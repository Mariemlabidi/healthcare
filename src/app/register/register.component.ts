import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone:false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  roles = [
    { value: 'client', label: 'Client' },
    { value: 'medecin', label: 'Médecin' },
    { value: 'admin', label: 'Administrateur' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Rediriger vers la page d'accueil si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
    
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['client', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Getter pour accéder facilement aux champs du formulaire
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Arrêter ici si le formulaire est invalide
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    const registerData: RegisterRequest = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: this.f['role'].value
    };

    this.authService.register(registerData)
      .subscribe({
        next: () => {
          this.redirectBasedOnRole();
        },
        error: error => {
          this.error = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
          this.loading = false;
        }
      });
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.currentUserValue;
    
    if (user) {
      switch (user.role) {
        case 'admin':
          this.router.navigate(['/admin-doctors']);
          break;
        case 'medecin':
          this.router.navigate(['/medecin-dashboard']);
          break;
        case 'client':
          this.router.navigate(['/client-dashboard']);
          break;
        default:
          this.router.navigate(['/']);
      }
    }
  }
}