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
    // Utiliser sessionStorage au lieu de localStorage
    const storedUser = sessionStorage.getItem('currentUser');
    const storedToken = sessionStorage.getItem('token');
    
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.tokenSubject = new BehaviorSubject<string | null>(storedToken);
    
    this.currentUser = this.currentUserSubject.asObservable();
    this.token = this.tokenSubject.asObservable();
    
    // Vérifier la validité du token au démarrage
    if (storedToken) {
      this.verifyToken().subscribe({
        error: () => {
          this.clearSession();
        }
      });
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

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

  logout(): Observable<any> {
    const token = this.tokenValue;
    const headers = token ? new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }) : undefined;

    return this.http.get<any>(`${this.apiUrl}/logout`, { headers })
      .pipe(
        tap(() => this.clearSession()),
        catchError(error => {
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  manualLogout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  clearSession(): void {
    // Utiliser sessionStorage au lieu de localStorage
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    
    this.router.navigate(['/login']);
  }

  private setSession(user: User, token: string): void {
    // Utiliser sessionStorage au lieu de localStorage
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.setItem('token', token);
    
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.tokenValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.tokenValue;
    
    if (!token) {
      return of(false);
    }
    
    return this.verifyToken().pipe(
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      })
    );
  }
  
  getAuthToken(): string | null {
    return this.tokenValue;
  }
}