import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree
} from '@angular/router';
import { Observable, map, of, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        // Si l'utilisateur est authentifié, autoriser l'accès
        if (isAuthenticated) {
          // Vérifier si un rôle spécifique est requis
          const requiredRole = route.data['role'] as string;
          if (requiredRole && !this.authService.hasRole(requiredRole)) {
            // L'utilisateur n'a pas le rôle requis, rediriger vers la page d'accueil
            return this.router.createUrlTree(['/']);
          }
          
          return true;
        }
        
        // L'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        return this.router.createUrlTree(['/login'], { 
          queryParams: { returnUrl: state.url }
        });
      })
    );
  }
}