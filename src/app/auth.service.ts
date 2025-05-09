// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
            // Stocker les détails de l'utilisateur et le token
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            localStorage.setItem('token', res.token);
            
            // Mettre à jour les Subjects
            this.currentUserSubject.next(res.data);
            this.tokenSubject.next(res.token);
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
            // Stocker les détails de l'utilisateur et le token
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            localStorage.setItem('token', res.token);
            
            // Mettre à jour les Subjects
            this.currentUserSubject.next(res.data);
            this.tokenSubject.next(res.token);
          }
        })
      );
  }

  // Déconnecter un utilisateur
  logout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/logout`)
      .pipe(
        tap(() => {
          // Supprimer les données du stockage local
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          
          // Réinitialiser les Subjects
          this.currentUserSubject.next(null);
          this.tokenSubject.next(null);
          
          // Rediriger vers la page de connexion
          this.router.navigate(['/login']);
        })
      );
  }

  // Récupérer les informations de l'utilisateur actuel
  getMe(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.tokenValue;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
}