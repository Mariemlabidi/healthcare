import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { 
  User, 
  AuthResponse, 
  RegisterRequest, 
  LoginRequest 
} from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    // Récupérer l'utilisateur et le token du stockage local au démarrage
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.tokenSubject = new BehaviorSubject<string | null>(storedToken);
    
    this.currentUser = this.currentUserSubject.asObservable();
    this.token = this.tokenSubject.asObservable();
    
    // Vérifier la validité du token au démarrage de l'application
    if (storedToken) {
      this.verifyToken().subscribe({
        error: () => this.clearSession()
      });
    }
  }

  // Getter pour accéder facilement à la valeur currentUser
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Getter pour accéder facilement à la valeur token
  public get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  // Enregistrer un nouvel utilisateur
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((res: AuthResponse) => {
          if (res.success && res.data && res.token) {
            this.setSession(res.data, res.token);
          }
        })
      );
  }

  // Connecter un utilisateur
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((res: AuthResponse) => {
          if (res.success && res.data && res.token) {
            this.setSession(res.data, res.token);
          }
        })
      );
  }

  // Vérifier la validité du token
 verifyToken(): Observable<any> {
  const token = this.tokenValue;

  if (!token) {
    return throwError(() => new Error('Aucun token disponible'));
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<any>(`${this.apiUrl}/verify-token`, { headers });
}

  // Déconnecter un utilisateur
  logout(): Observable<any> {
    // Envoyer une requête de déconnexion au serveur
    const token = this.tokenValue;
    const headers = token ? new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }) : undefined;

    return this.http.get<any>(`${this.apiUrl}/logout`, { headers })
      .pipe(
        tap(() => this.clearSession()),
        catchError(error => {
          // Même en cas d'erreur, on efface la session locale
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  // Méthode pour déconnexion manuelle (sans appel API)
  manualLogout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  // Nettoyer la session
  clearSession(): void {
    // Supprimer les données du stockage local
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    // Réinitialiser les Subjects
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }

  // Configurer la session
  private setSession(user: User, token: string): void {
    // Stocker les détails de l'utilisateur et le token
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    
    // Mettre à jour les Subjects
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
  }

  // Vérifier si l'utilisateur est connecté avec vérification de la validité du token
  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.tokenValue;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
  
  // NOUVELLES MÉTHODES POUR COMPATIBILITÉ AVEC LE COMPOSANT APPOINTMENT

  // Vérifier l'authentification (renvoie un Observable<boolean>)
  isAuthenticated(): Observable<boolean> {
    const token = this.tokenValue;
    
    if (!token) {
      return of(false);
    }
    
    // Vérifier la validité du token
    return this.verifyToken().pipe(
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      })
    );
  }
  
  // Récupérer le token pour les en-têtes d'autorisation
  getAuthToken(): string | null {
    return this.tokenValue;
  }
}