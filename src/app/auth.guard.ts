
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
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

