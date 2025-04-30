import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getCurrentUser(); // Récupérer l'utilisateur connecté
    if (user && user.role === 'patient') {
      return true;
    }

    // Redirige vers la page d'accueil ou une page d'erreur si non autorisé
    this.router.navigate(['/']);
    return false;
  }
}

