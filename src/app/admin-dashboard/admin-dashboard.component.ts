import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service.service';
import { AuthService } from '../auth.service';
import { Doctor, Patient, Stats } from '../../models/dashboard.model';
import { User } from '../../models/user.model';
import { catchError, tap, finalize } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  selectedDoctor: Doctor | null = null;
  selectedPatient: Patient | null = null;
  doctorChart: Chart | null = null;
  patientChart: Chart | null = null;
  loading = true;
  loadingDoctors = false;
  loadingPatients = false;
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
    console.log('AdminDashboardComponent - ngOnInit called');
    
    // Vérifier l'authentification et charger les données
    this.authService.currentUser.subscribe({
      next: (user) => {
        console.log('Current user:', user);
        this.currentUser = user;
        this.isLoggedIn = !!user;
        
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        if (!this.isLoggedIn) {
          console.log('User not logged in, redirecting to login');
          this.router.navigate(['/login']);
          return;
        }

        // Vérifier que l'utilisateur a le rôle admin
        if (this.currentUser && this.currentUser.role !== 'admin') {
          console.log('User is not admin, redirecting to home');
          this.router.navigate(['/']);
          return;
        }
        
        // Charger les données du tableau de bord
        console.log('User authenticated as admin, loading dashboard data');
        this.fetchData();
      },
      error: (error) => {
        console.error('Error checking authentication:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  ngAfterViewInit(): void {
    console.log('AdminDashboardComponent - ngAfterViewInit called');
  }

  fetchData(): void {
    this.loading = true;
    console.log('=== Début du chargement des données ===');
    console.log('API Base URL:', this.dashboardService['baseUrl']);

    // Utiliser forkJoin pour charger toutes les données en parallèle
    const requests = {
      stats: this.getStats(),
      doctors: this.getDoctors(),
      patients: this.getPatients()
    };

    forkJoin(requests).pipe(
      finalize(() => {
        this.loading = false;
        console.log('=== Fin du chargement des données ===');
        console.log('Données finales:', {
          doctors: this.doctors.length,
          patients: this.patients.length,
          stats: this.stats
        });
      })
    ).subscribe({
      next: (results) => {
        console.log('Toutes les données chargées avec succès:', results);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
      }
    });
  }

  private getStats() {
    return this.dashboardService.getStats().pipe(
      tap(stats => {
        console.log('✓ Stats récupérées:', stats);
        this.stats = stats;
      }),
      catchError(error => {
        console.error('✗ Erreur stats:', error);
        this.stats = {
          totalDoctors: 0,
          totalPatients: 0,
          totalAppointments: 0,
          appointmentsToday: 0
        };
        return of(this.stats);
      })
    );
  }

  private getDoctors() {
    this.loadingDoctors = true;
    console.log('🏥 Chargement des médecins...');
    
    return this.dashboardService.getDoctors().pipe(
      tap(doctors => {
        console.log('✓ Médecins récupérés:', doctors);
        console.log('✓ Nombre de médecins:', doctors.length);
        
        this.doctors = doctors;
        
        // Afficher chaque médecin
        this.doctors.forEach((doctor, index) => {
          console.log(`  - Médecin ${index + 1}: ID=${doctor.id}, Nom=${doctor.name}`);
        });
        
        // Sélectionner le premier médecin automatiquement
        if (this.doctors.length > 0) {
          console.log('Auto-sélection du premier médecin');
          setTimeout(() => this.selectDoctor('0'), 100);
        } else {
          console.warn('⚠️ Aucun médecin trouvé dans la base de données');
        }
      }),
      catchError(error => {
        console.error('✗ Erreur médecins:', error);
        this.doctors = [];
        return of([]);
      }),
      finalize(() => {
        this.loadingDoctors = false;
        console.log('🏥 Chargement des médecins terminé');
      })
    );
  }

  private getPatients() {
    this.loadingPatients = true;
    console.log('👥 Chargement des patients...');
    
    return this.dashboardService.getPatients().pipe(
      tap(patients => {
        console.log('✓ Patients récupérés:', patients);
        console.log('✓ Nombre de patients:', patients.length);
        
        this.patients = patients;
        
        // Afficher chaque patient
        this.patients.forEach((patient, index) => {
          console.log(`  - Patient ${index + 1}: ID=${patient.id}, Nom=${patient.name}`);
        });
        
        // Sélectionner le premier patient automatiquement
        if (this.patients.length > 0) {
          console.log('Auto-sélection du premier patient');
          setTimeout(() => this.selectPatient('0'), 100);
        } else {
          console.warn('⚠️ Aucun patient trouvé dans la base de données');
        }
      }),
      catchError(error => {
        console.error('✗ Erreur patients:', error);
        this.patients = [];
        return of([]);
      }),
      finalize(() => {
        this.loadingPatients = false;
        console.log('👥 Chargement des patients terminé');
      })
    );
  }

  selectDoctor(doctorIndexStr: string): void {
    try {
      console.log('🔍 Sélection du médecin:', doctorIndexStr);
      
      const doctorIndex = parseInt(doctorIndexStr, 10);
      if (isNaN(doctorIndex) || doctorIndex < 0 || doctorIndex >= this.doctors.length) {
        console.warn('Index de médecin invalide:', doctorIndexStr);
        return;
      }

      const doctor = this.doctors[doctorIndex];
      console.log('✓ Médecin sélectionné:', doctor);
      this.selectedDoctor = doctor;

      // Charger les rendez-vous du médecin
      this.dashboardService.getDoctorAppointments(doctor.id).pipe(
        tap(appointments => {
          console.log('✓ Rendez-vous du médecin récupérés:', appointments);
        }),
        catchError(error => {
          console.error(`✗ Erreur rendez-vous médecin ${doctor.id}:`, error);
          return of([]);
        })
      ).subscribe(appointments => {
        if (this.selectedDoctor) {
          this.selectedDoctor.appointmentsPerDay = appointments;
          setTimeout(() => this.renderDoctorChart(), 100);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la sélection du médecin:', error);
    }
  }

  selectPatient(patientIndexStr: string): void {
    try {
      console.log('🔍 Sélection du patient:', patientIndexStr);
      
      const patientIndex = parseInt(patientIndexStr, 10);
      if (isNaN(patientIndex) || patientIndex < 0 || patientIndex >= this.patients.length) {
        console.warn('Index de patient invalide:', patientIndexStr);
        return;
      }

      const patient = this.patients[patientIndex];
      console.log('✓ Patient sélectionné:', patient);
      this.selectedPatient = patient;

      this.dashboardService.getPatientAppointments(patient.id).pipe(
        tap(appointments => {
          console.log('✓ Rendez-vous du patient récupérés:', appointments);
        }),
        catchError(error => {
          console.error(`✗ Erreur rendez-vous patient ${patient.id}:`, error);
          return of([]);
        })
      ).subscribe(appointments => {
        if (this.selectedPatient) {
          this.selectedPatient.appointmentsPerMonth = appointments;
          setTimeout(() => this.renderPatientChart(), 100);
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

    console.log('📊 Création du graphique médecin:', { labels, data });

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

    console.log('📊 Création du graphique patient:', { labels, data });

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

  // Méthode pour recharger manuellement les données
  refreshData(): void {
    console.log('🔄 Rechargement manuel des données');
    this.fetchData();
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
        this.authService.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}