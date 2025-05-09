import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../dashboard.service.service';

Chart.register(...registerables);

interface Doctor {
  id: string;
  name: string;
  appointmentsPerDay: { date: string; count: number }[];
}

interface Patient {
  id: string;
  name: string;
  appointmentsPerMonth: { month: string; count: number }[];
}

interface Stats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  appointmentsToday: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
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
  stats: Stats = {
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    appointmentsToday: 0
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    this.dashboardService.getStats().subscribe({
      next: (stats: Stats) => {
        this.stats = stats;
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    });

    this.dashboardService.getDoctors().subscribe({
      next: (doctors: Doctor[]) => {
        this.doctors = doctors;
        if (this.doctors.length > 0) {
          this.selectDoctor(this.doctors[0]);
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des médecins:', error);
      }
    });

    this.dashboardService.getPatients().subscribe({
      next: (patients: Patient[]) => {
        this.patients = patients;
        if (this.patients.length > 0) {
          this.selectPatient(this.patients[0]);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des patients:', error);
        this.loading = false;
      }
    });
  }

  selectDoctor(doctorOrIndex: Doctor | string): void {
    const doctor = typeof doctorOrIndex === 'string'
      ? this.doctors[+doctorOrIndex]
      : doctorOrIndex;

    if (!doctor) return;

    this.selectedDoctor = doctor;

    this.dashboardService.getDoctorAppointments(doctor.id).subscribe({
      next: (appointments: { date: string; count: number }[]) => {
        this.selectedDoctor!.appointmentsPerDay = appointments;
        this.renderDoctorChart();
      },
      error: (error: any) => {
        console.error(`Erreur lors de la récupération des rendez-vous du médecin ${doctor.id}:`, error);
      }
    });
  }

  selectPatient(patientOrIndex: Patient | string): void {
    const patient = typeof patientOrIndex === 'string'
      ? this.patients[+patientOrIndex]
      : patientOrIndex;

    if (!patient) return;

    this.selectedPatient = patient;

    this.dashboardService.getPatientAppointments(patient.id).subscribe({
      next: (appointments: { month: string; count: number }[]) => {
        this.selectedPatient!.appointmentsPerMonth = appointments;
        this.renderPatientChart();
      },
      error: (error: any) => {
        console.error(`Erreur lors de la récupération des rendez-vous du patient ${patient.id}:`, error);
      }
    });
  }

  renderDoctorChart(): void {
    if (!this.selectedDoctor) return;

    const ctx = document.getElementById('doctorChart') as HTMLCanvasElement;

    if (this.doctorChart) {
      this.doctorChart.destroy();
    }

    const labels = this.selectedDoctor.appointmentsPerDay.map(item => item.date);
    const data = this.selectedDoctor.appointmentsPerDay.map(item => item.count);

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
    if (!this.selectedPatient) return;

    const ctx = document.getElementById('patientChart') as HTMLCanvasElement;

    if (this.patientChart) {
      this.patientChart.destroy();
    }

    const labels = this.selectedPatient.appointmentsPerMonth.map(item => item.month);
    const data = this.selectedPatient.appointmentsPerMonth.map(item => item.count);

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
}
