import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Récupérer le token d'authentification
    const token = this.authService.getAuthToken();

    // Si un token existe, ajouter l'en-tête d'autorisation
    if (token) {
      request = this.addToken(request, token);
    }

    // Continuer avec la requête modifiée et intercepter les erreurs
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Gérer les erreurs 401 Unauthorized
        if (error.status === 401) {
          // Si le token est expiré ou invalide, déconnecter l'utilisateur
          this.authService.clearSession();
          
          // Rediriger vers la page de connexion avec l'URL de retour
          this.router.navigate(['/login'], { 
            queryParams: { 
              returnUrl: this.router.url,
              expired: 'true'  // Indicateur que la session a expiré
            } 
          });
        }
        
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string) {
    // Cloner la requête et ajouter l'en-tête d'autorisation
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}