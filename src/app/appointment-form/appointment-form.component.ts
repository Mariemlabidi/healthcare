import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';

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
    this.http.get<any>(`${this.apiUrl}/availability?date=${date}`).subscribe({
      next: (response) => {
        if (response.success && response.availableTimeSlots) {
          this.availableTimeSlots = response.availableTimeSlots;
          
          // Réinitialiser le créneau horaire si celui sélectionné n'est plus disponible
          const currentTime = this.appointmentForm.get('appointmentTime')?.value;
          if (currentTime && !this.availableTimeSlots.includes(currentTime)) {
            this.appointmentForm.get('appointmentTime')?.setValue('');
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des créneaux disponibles:', error);
        this.availableTimeSlots = [];
      }
    });
  }

  onSubmit() {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    if (this.appointmentForm.invalid) {
      Object.keys(this.appointmentForm.controls).forEach(key => {
        this.appointmentForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Vérifier d'abord si l'utilisateur est connecté
    if (!this.isLoggedIn) {
      // Stocker l'URL actuelle pour y revenir après la connexion
      const returnUrl = this.router.url;
      // Rediriger vers la page de connexion
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl }
      });
      return;
    }

    // Éviter les soumissions multiples
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.formError = null;

    // Ajout du token d'authentification dans les requêtes HTTP
    const token = this.authService.getAuthToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post(this.apiUrl, this.appointmentForm.value, { headers })
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.formSubmitted = true;
          console.log('Rendez-vous enregistré:', response);
          
          // Réinitialiser le formulaire après succès
          this.appointmentForm.reset();
          
          // Rediriger vers une page de confirmation avec le détail du rendez-vous
          this.router.navigate(['/appointments/confirmation'], { 
            state: { appointment: response.data } 
          });
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
          
          // Gestion des erreurs spécifiques
          if (error.status === 401) {
            this.formError = 'Votre session a expiré. Veuillez vous reconnecter.';
            this.authService.clearSession();
          } else if (error.status === 400 && error.error?.message) {
            this.formError = error.error.message;
          } else {
            this.formError = 'Une erreur est survenue lors de l\'enregistrement du rendez-vous.';
          }
        }
      });
  }
}