import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../appointment.service';
import { AuthService } from '../auth.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-client-appointments',
  standalone: false,
  templateUrl: './client-appointments.component.html',
  styleUrls: ['./client-appointments.component.css']
})
export class ClientAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  pastAppointments: Appointment[] = [];
  loading = true;
  error: string | null = null;
  success: string | null = null;
  activeFilter: 'all' | 'upcoming' | 'past' = 'all';
  
  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadAppointments();
  }

  // Check if user is logged in
  checkLoginStatus(): void {
    this.authService.isAuthenticated().subscribe(
      (isLoggedIn) => {
        if (!isLoggedIn) {
          const returnUrl = this.router.url;
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl }
          });
        }
      }
    );
  }

  // Load all appointments for the user
  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getUserAppointments().subscribe({
      next: (response) => {
        console.log('Réponse complète du serveur:', response); // Débogage
        if (response.success) {
          // Conversion explicite en tableau si nécessaire
          this.appointments = Array.isArray(response.data) 
            ? response.data 
            : response.data ? [response.data as Appointment] : [];
          
          console.log('Appointments après conversion:', this.appointments); // Débogage
          this.filterAppointments();
        } else {
          this.error = response.message || 'Une erreur est survenue lors du chargement des rendez-vous.';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rendez-vous:', error);
        if (error.status === 401) {
          this.error = 'Votre session a expiré. Veuillez vous reconnecter.';
          setTimeout(() => this.authService.clearSession(), 2000);
        } else {
          this.error = 'Une erreur est survenue lors du chargement des rendez-vous.';
        }
        this.loading = false;
      }
    });
  }

  // Filter appointments into upcoming and past
  filterAppointments(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.upcomingAppointments = this.appointments.filter(appointment => {
      // Vérification que appointmentDate est défini
      if (!appointment.appointmentDate) {
        console.warn('Rendez-vous sans date trouvé:', appointment);
        return false;
      }
      
      // Conversion sécurisée de la date
      const appointmentDate = new Date(appointment.appointmentDate);
      
      // Vérification des statuts en français
      return appointmentDate >= today && 
             (appointment.status === 'planifié' || appointment.status === 'confirmé');
    }).sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return dateA.getTime() - dateB.getTime();
    });
    
    this.pastAppointments = this.appointments.filter(appointment => {
      // Vérification que appointmentDate est défini
      if (!appointment.appointmentDate) {
        return false;
      }
      
      // Conversion sécurisée de la date
      const appointmentDate = new Date(appointment.appointmentDate);
      
      // Vérification des statuts en français
      return appointmentDate < today || 
             appointment.status === 'annulé' || 
             appointment.status === 'terminé';
    }).sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return dateB.getTime() - dateA.getTime(); // Newest first for past appointments
    });
    
    console.log('Rendez-vous à venir:', this.upcomingAppointments);
    console.log('Rendez-vous passés:', this.pastAppointments);
  }

  // Set active filter
  setFilter(filter: 'all' | 'upcoming' | 'past'): void {
    this.activeFilter = filter;
  }

  // Cancel an appointment
  cancelAppointment(appointmentId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous?')) {
      return;
    }
    
    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Rendez-vous annulé avec succès.';
          // Update the appointment in the local list
          const index = this.appointments.findIndex(a => a._id === appointmentId);
          if (index !== -1) {
            this.appointments[index].status = 'annulé'; // ✅ Statut en français
            this.filterAppointments(); // Re-filter to update the lists
          }
          setTimeout(() => this.success = null, 3000);
        } else {
          this.error = response.message || 'Une erreur est survenue lors de l\'annulation du rendez-vous.';
          setTimeout(() => this.error = null, 3000);
        }
      },
      error: (error) => {
        console.error('Erreur lors de l\'annulation du rendez-vous:', error);
        this.error = 'Une erreur est survenue lors de l\'annulation du rendez-vous.';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  // Format date for display
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  // Navigate to new appointment page
  bookNewAppointment(): void {
    this.router.navigate(['/appointments/new']);
  }

  // Determine appointment status class
  getStatusClass(appointment: Appointment): string {
    if (!appointment.appointmentDate) {
      return 'status-unknown';
    }
    
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    
    // Utilisation des statuts en français
    if (appointment.status === 'annulé') {
      return 'status-cancelled';
    } else if (appointment.status === 'terminé' || appointmentDate < today) {
      return 'status-completed';
    } else {
      return 'status-upcoming';
    }
  }
}