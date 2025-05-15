import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit(): void {
    // S'assurer que l'utilisateur est déconnecté lorsqu'il visite la page de login
    // Cette approche est optionnelle mais résout le problème original
    this.authService.manualLogout();
  }

  // Getter pour accéder facilement aux champs du formulaire
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Arrêter ici si le formulaire est invalide
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    const loginData: LoginRequest = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.login(loginData)
      .subscribe({
        next: () => {
          this.redirectBasedOnRole();
        },
        error: error => {
          this.error = error.error?.message || 'Une erreur est survenue lors de la connexion';
          this.loading = false;
        }
      });
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.currentUserValue;
    
    if (user) {
      switch (user.role) {
        case 'admin':
          this.router.navigate(['/admin-dashboard']);
          break;
        case 'medecin':
          this.router.navigate(['/medecin-dashboard']);
          break;
        case 'client':
          this.router.navigate(['']);
          break;
        default:
          this.router.navigate(['/']);
      }
    }
  }
}