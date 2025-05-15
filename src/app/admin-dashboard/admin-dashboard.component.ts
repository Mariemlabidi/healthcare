import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service.service';
import { AuthService } from '../auth.service';
import { Doctor, Patient, Stats } from '../../models/dashboard.model';
import { User } from '../../models/user.model';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone:false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  selectedDoctor: Doctor | null = null;
  selectedPatient: Patient | null = null;
  doctorChart: Chart | null = null;
  patientChart: Chart | null = null;
  loading = true;
  currentUser: User | null = null;
  isLoggedIn = false;
  stats: Stats = {
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    appointmentsToday: 0
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier l'authentification et charger les données
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      if (!this.isLoggedIn) {
        this.router.navigate(['/login']);
        return;
      }

      // Vérifier que l'utilisateur a le rôle admin
      if (this.currentUser && this.currentUser.role !== 'admin') {
        this.router.navigate(['/']);
        return;
      }
      
      // Charger les données du tableau de bord
      this.fetchData();
    });
  }

  fetchData(): void {
    this.loading = true;
    console.log('Fetching dashboard data...');
    console.log('API Base URL:', this.dashboardService['baseUrl']);

    // RÉCUPÉRER LES STATISTIQUES
    this.dashboardService.getStats().pipe(
      tap(stats => console.log('Stats received:', stats)),
      catchError(error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
        return of({
          totalDoctors: 0,
          totalPatients: 0,
          totalAppointments: 0,
          appointmentsToday: 0
        });
      })
    ).subscribe(stats => {
      this.stats = stats;
    });

    // RÉCUPÉRER LES MÉDECINS
    this.dashboardService.getDoctors().pipe(
      tap(doctors => console.log('Doctors received:', doctors)),
      catchError(error => {
        console.error('Erreur lors de la récupération des médecins:', error);
        return of([]);
      })
    ).subscribe(doctors => {
      this.doctors = doctors;
      console.log(`Loaded ${this.doctors.length} doctors`);
      
      if (this.doctors.length > 0) {
        this.selectDoctor('0');
      }
    });

    // RÉCUPÉRER LES PATIENTS
    this.dashboardService.getPatients().pipe(
      tap(patients => console.log('Patients received:', patients)),
      catchError(error => {
        console.error('Erreur lors de la récupération des patients:', error);
        return of([]);
      })
    ).subscribe(patients => {
      this.patients = patients;
      console.log(`Loaded ${this.patients.length} patients`);
      
      if (this.patients.length > 0) {
        this.selectPatient('0');
      }
      
      this.loading = false;
    });
  }

  selectDoctor(doctorIndexStr: string): void {
    try {
      const doctorIndex = parseInt(doctorIndexStr, 10);
      if (isNaN(doctorIndex) || doctorIndex < 0 || doctorIndex >= this.doctors.length) {
        console.warn('Index de médecin invalide:', doctorIndexStr);
        return;
      }

      const doctor = this.doctors[doctorIndex];
      console.log('Médecin sélectionné:', doctor);
      this.selectedDoctor = doctor;

      this.dashboardService.getDoctorAppointments(doctor.id).pipe(
        tap(appointments => console.log('Doctor appointments received:', appointments)),
        catchError(error => {
          console.error(`Erreur lors de la récupération des rendez-vous du médecin ${doctor.id}:`, error);
          return of([]);
        })
      ).subscribe(appointments => {
        if (this.selectedDoctor) {
          this.selectedDoctor.appointmentsPerDay = appointments;
          this.renderDoctorChart();
        }
      });
    } catch (error) {
      console.error('Erreur lors de la sélection du médecin:', error);
    }
  }

  selectPatient(patientIndexStr: string): void {
    try {
      const patientIndex = parseInt(patientIndexStr, 10);
      if (isNaN(patientIndex) || patientIndex < 0 || patientIndex >= this.patients.length) {
        console.warn('Index de patient invalide:', patientIndexStr);
        return;
      }

      const patient = this.patients[patientIndex];
      console.log('Patient sélectionné:', patient);
      this.selectedPatient = patient;

      this.dashboardService.getPatientAppointments(patient.id).pipe(
        tap(appointments => console.log('Patient appointments received:', appointments)),
        catchError(error => {
          console.error(`Erreur lors de la récupération des rendez-vous du patient ${patient.id}:`, error);
          return of([]);
        })
      ).subscribe(appointments => {
        if (this.selectedPatient) {
          this.selectedPatient.appointmentsPerMonth = appointments;
          this.renderPatientChart();
        }
      });
    } catch (error) {
      console.error('Erreur lors de la sélection du patient:', error);
    }
  }

  renderDoctorChart(): void {
    if (!this.selectedDoctor || !this.selectedDoctor.appointmentsPerDay) {
      console.warn('Données insuffisantes pour afficher le graphique du médecin');
      return;
    }

    const ctx = document.getElementById('doctorChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Élément Canvas "doctorChart" non trouvé dans le DOM');
      return;
    }

    if (this.doctorChart) {
      this.doctorChart.destroy();
    }

    const labels = this.selectedDoctor.appointmentsPerDay.map(item => item.date);
    const data = this.selectedDoctor.appointmentsPerDay.map(item => item.count);

    console.log('Création du graphique pour le médecin avec ces données:', { labels, data });

    this.doctorChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Rendez-vous par jour',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

  renderPatientChart(): void {
    if (!this.selectedPatient || !this.selectedPatient.appointmentsPerMonth) {
      console.warn('Données insuffisantes pour afficher le graphique du patient');
      return;
    }

    const ctx = document.getElementById('patientChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Élément Canvas "patientChart" non trouvé dans le DOM');
      return;
    }

    if (this.patientChart) {
      this.patientChart.destroy();
    }

    const labels = this.selectedPatient.appointmentsPerMonth.map(item => item.month);
    const data = this.selectedPatient.appointmentsPerMonth.map(item => item.count);

    console.log('Création du graphique pour le patient avec ces données:', { labels, data });

    this.patientChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Rendez-vous par mois',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

  // Méthode de déconnexion
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Déconnexion réussie');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion', error);
        // Même en cas d'erreur, on supprime les données locales et on redirige
        this.authService.clearSession;
        this.router.navigate(['/login']);
      }
    });
  }
}