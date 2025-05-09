// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Vérifie si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Vérifie si le rôle de l'utilisateur correspond à celui requis pour la route
    const requiredRole = route.data['role'];
    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      // Redirige vers la page d'accueil ou d'accès refusé
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }
}