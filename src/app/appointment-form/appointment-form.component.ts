import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-appointment-form',
  standalone: false,
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;
  apiUrl = 'http://localhost:5000/api/appointments'; // URL de votre API

  constructor(
    private fb: FormBuilder,
    private http: HttpClient // Injecter HttpClient ici
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

  onSubmit() {
    if (this.appointmentForm.valid) {
      // Utiliser this.http qui est maintenant correctement injecté
      this.http.post(this.apiUrl, this.appointmentForm.value)
        .subscribe({
          next: (response) => {
            console.log('Rendez-vous enregistré:', response);
            // Réinitialiser le formulaire après succès
            this.appointmentForm.reset();
            // Vous pourriez afficher un message de succès ici
          },
          error: (error) => {
            console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
            // Vous pourriez afficher un message d'erreur ici
          }
        });
    } else {
      console.log('Formulaire invalide');
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.appointmentForm.controls).forEach(key => {
        this.appointmentForm.get(key)?.markAsTouched();
      });
    }
  }
}

