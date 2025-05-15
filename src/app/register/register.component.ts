import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; // Utilisation de l'opérateur ! pour indiquer à TypeScript que cette propriété sera initialisée
  loading = false;
  submitted = false;
  error = '';
  roles = [
    { value: 'client', label: 'client' }, // Corrigé : 'client' au lieu de 'patient'
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
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      role: ['client', Validators.required] // Valeur par défaut modifiée à 'client'
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;
    
    // Si l'un des champs n'est pas rempli, ne pas valider
    if (!password || !passwordConfirm) {
      return null;
    }

    return password === passwordConfirm ? null : { mismatch: true };
  }

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
      passwordConfirm: this.f['passwordConfirm'].value,
      role: this.f['role'].value
    };

    console.log('Données d\'inscription avant envoi:', registerData);

    this.authService.register(registerData)
      .subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          // S'authentifier automatiquement après l'inscription
          this.authService.login({
            email: registerData.email,
            password: registerData.password
          }).subscribe({
            next: () => {
              console.log('Connexion automatique réussie');
              this.redirectBasedOnRole();
            },
            error: (loginError) => {
              console.error('Erreur lors de la connexion automatique:', loginError);
              this.error = 'Inscription réussie, mais échec de la connexion automatique. Veuillez vous connecter.';
              this.loading = false;
              this.router.navigate(['/login']);
            }
          });
        },
        error: (error) => {
          console.error('Erreur d\'inscription:', error);
          if (error.error && error.error.message) {
            this.error = error.error.message;
          } else if (error.status === 500) {
            this.error = 'Erreur serveur interne. Veuillez réessayer plus tard ou contacter l\'administrateur.';
          } else {
            this.error = 'Une erreur est survenue lors de l\'inscription';
          }
          this.loading = false;
        }
      });
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.currentUserValue;
    
    if (user) {
      console.log('Redirection basée sur le rôle:', user.role);
      switch (user.role) {
        case 'admin':
          this.router.navigate(['/admin-doctors']);
          break;
        case 'medecin':
          this.router.navigate(['/medecin-dashboard']);
          break;
        case 'client':
          this.router.navigate(['/']);
          break;
        default:
          this.router.navigate(['/']);
      }
    } else {
      console.error('Aucun utilisateur trouvé pour la redirection');
      this.router.navigate(['/login']);
    }
  }
}