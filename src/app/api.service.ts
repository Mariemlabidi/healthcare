import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { User, LoginRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  private tokenSubject: BehaviorSubject<string | null>;
  
  public currentUser: Observable<User | null>;
  public token: Observable<string | null>;

  constructor(private http: HttpClient) {
    // Récupérer les données stockées dans le localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');

    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.tokenSubject = new BehaviorSubject<string | null>(storedToken);

    this.currentUser = this.currentUserSubject.asObservable();
    this.token = this.tokenSubject.asObservable();
  }

  // Getter pour accéder à la valeur actuelle de l'utilisateur
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Getter pour accéder à la valeur actuelle du token
  public get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  login(loginData: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(res => {
          if (res.success && res.data && res.token) {
            // Stocker les informations utilisateurs et le token
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            localStorage.setItem('token', res.token);
            
            // Mettre à jour les sujets
            this.currentUserSubject.next(res.data);
            this.tokenSubject.next(res.token);
          }
        }),
        catchError(error => {
          console.error('Erreur de connexion:', error);
          return throwError(() => error);
        })
      );
  }

  register(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(res => {
          if (res.success && res.data && res.token) {
            // Stocker les informations utilisateurs et le token
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            localStorage.setItem('token', res.token);
            
            // Mettre à jour les sujets
            this.currentUserSubject.next(res.data);
            this.tokenSubject.next(res.token);
          }
        }),
        catchError(error => {
          console.error('Erreur d\'inscription:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    // Appel API pour la déconnexion côté serveur
    return this.http.get<any>(`${this.apiUrl}/logout`)
      .pipe(
        tap(() => {
          this.clearLocalStorage();
        }),
        catchError(error => {
          console.error('Erreur de déconnexion:', error);
          // Même en cas d'erreur, on nettoie les données locales
          this.clearLocalStorage();
          return throwError(() => error);
        })
      );
  }

  // Méthode pour effacer les données de session locales
  clearLocalStorage(): void {
    // Supprimer les données du localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    // Réinitialiser les sujets
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.tokenValue;
  }

  // Vérifier la validité du token avec le serveur
  validateToken(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`)
      .pipe(
        catchError(error => {
          if (error.status === 401 || error.status === 403) {
            // Token invalide, déconnecter l'utilisateur
            this.clearLocalStorage();
          }
          return throwError(() => error);
        })
      );
  }
}