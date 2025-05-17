import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-appointment-form',
  standalone: false,
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  apiUrl = `${environment.apiUrl}/appointments`;
  isLoggedIn = false;
  availableTimeSlots: string[] = [];
  isSubmitting = false;
  formSubmitted = false;
  formError: string | null = null;
  formSuccess: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      patientName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté lors de l'initialisation du composant
    this.checkLoginStatus();
    
    // Pré-remplir le formulaire avec les informations de l'utilisateur connecté si disponibles
    this.prepopulateForm();
    
    // Ajouter un écouteur sur le changement de date pour charger les créneaux disponibles
    this.appointmentForm.get('appointmentDate')?.valueChanges.subscribe(date => {
      if (date) {
        this.loadAvailableTimeSlots(date);
      }
    });
  }

  // Méthode pour vérifier le statut de connexion
  checkLoginStatus(): void {
    // Utiliser la méthode isAuthenticated qui retourne un Observable
    this.authService.isAuthenticated().subscribe(
      (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        if (!isLoggedIn) {
          const returnUrl = this.router.url;
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl }
          });
        }
      }
    );
  }
  
  // Pré-remplir le formulaire avec les informations de l'utilisateur
  prepopulateForm(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Pré-remplir le nom, email et téléphone s'ils sont disponibles
      this.appointmentForm.patchValue({
        patientName: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });
    }
  }
  
  // Charger les créneaux horaires disponibles pour la date sélectionnée
  loadAvailableTimeSlots(date: string): void {
    // Cette route est publique, pas besoin d'authentification selon votre backend
    this.http.get<any>(`${this.apiUrl}/availability?date=${date}`)
      .subscribe({
        next: (response) => {
          if (response.success && response.availableTimeSlots) {
            this.availableTimeSlots = response.availableTimeSlots;
            
            // Réinitialiser le créneau horaire si celui sélectionné n'est plus disponible
            const currentTime = this.appointmentForm.get('appointmentTime')?.value;
            if (currentTime && !this.availableTimeSlots.includes(currentTime)) {
              this.appointmentForm.get('appointmentTime')?.setValue('');
            }
          } else {
            // Initialiser avec des créneaux par défaut au cas où le backend ne répond pas correctement
            this.availableTimeSlots = [
              '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
              '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
            ];
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement des créneaux disponibles:', error);
          // Utiliser des créneaux par défaut en cas d'erreur
          this.availableTimeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
          ];
        }
      });
  }

  onSubmit() {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    if (this.appointmentForm.invalid) {
      Object.keys(this.appointmentForm.controls).forEach(key => {
        this.appointmentForm.get(key)?.markAsTouched();
      });
      this.formError = "Veuillez remplir tous les champs obligatoires correctement.";
      return;
    }

    // Réinitialiser les messages d'erreur/succès
    this.formError = null;
    this.formSuccess = null;

    // Vérifier à nouveau si l'utilisateur est connecté
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.formError = "Votre session a expiré. Vous allez être redirigé vers la page de connexion.";
        setTimeout(() => {
          const returnUrl = this.router.url;
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl }
          });
        }, 2000);
        return;
      }
      
      // Continuer avec la soumission si authentifié
      this.submitAppointment();
    });
  }
  
  private submitAppointment() {
    // Éviter les soumissions multiples
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.formError = null;

    // Récupérer le token
    const token = this.authService.getAuthToken();
    
    if (!token) {
      this.formError = "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
      this.isSubmitting = false;
      setTimeout(() => this.authService.clearSession(), 2000);
      return;
    }
    
    // Construire les en-têtes avec le token d'authentification
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    this.http.post(this.apiUrl, this.appointmentForm.value, { headers })
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.formSubmitted = true;
          this.formSuccess = "Rendez-vous enregistré avec succès!";
          
          // Réinitialiser le formulaire après succès
          setTimeout(() => {
            this.appointmentForm.reset();
            // Rediriger vers une page de confirmation avec le détail du rendez-vous
            this.router.navigate(['/appointments/confirmation'], { 
              state: { appointment: response.data } 
            });
          }, 1500);
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
          
          // Gestion des erreurs spécifiques
          if (error.status === 401) {
            // Afficher le message d'erreur complet du serveur
            console.error('Détails de l\'erreur 401:', error.error);
            this.formError = 'Erreur d\'authentification: ' + (error.error?.message || 'Votre session a expiré. Veuillez vous reconnecter.');
            setTimeout(() => this.authService.clearSession(), 2000); // Ceci va rediriger vers login après 2 secondes
          } else if (error.status === 400 && error.error?.message) {
            this.formError = error.error.message;
          } else {
            this.formError = 'Une erreur est survenue lors de l\'enregistrement du rendez-vous.';
          }
        }
      });
  }
}