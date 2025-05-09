import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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

interface DoctorAppointment {
  date: string; 
  count: number;
}

interface PatientAppointment {
  month: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'api';  // Base URL de votre API

  // Données fictives pour les tests
  private mockStats: Stats = {
    totalDoctors: 12,
    totalPatients: 243,
    totalAppointments: 567,
    appointmentsToday: 24
  };

  private mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Smith',
      appointmentsPerDay: []
    },
    {
      id: '2',
      name: 'Dr. Johnson',
      appointmentsPerDay: []
    },
    {
      id: '3',
      name: 'Dr. Williams',
      appointmentsPerDay: []
    }
  ];

  private mockPatients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      appointmentsPerMonth: []
    },
    {
      id: '2',
      name: 'Jane Smith',
      appointmentsPerMonth: []
    },
    {
      id: '3',
      name: 'Robert Brown',
      appointmentsPerMonth: []
    }
  ];

  // Utilisation de Map pour les rendez-vous des médecins
  private mockDoctorAppointments = new Map<string, DoctorAppointment[]>([
    ['1', [
      { date: '2025-05-01', count: 5 },
      { date: '2025-05-02', count: 3 },
      { date: '2025-05-03', count: 7 },
      { date: '2025-05-04', count: 2 },
      { date: '2025-05-05', count: 4 }
    ]],
    ['2', [
      { date: '2025-05-01', count: 4 },
      { date: '2025-05-02', count: 6 },
      { date: '2025-05-03', count: 2 },
      { date: '2025-05-04', count: 5 },
      { date: '2025-05-05', count: 3 }
    ]],
    ['3', [
      { date: '2025-05-01', count: 6 },
      { date: '2025-05-02', count: 4 },
      { date: '2025-05-03', count: 5 },
      { date: '2025-05-04', count: 3 },
      { date: '2025-05-05', count: 7 }
    ]]
  ]);

  // Utilisation de Map pour les rendez-vous des patients
  private mockPatientAppointments = new Map<string, PatientAppointment[]>([
    ['1', [
      { month: 'Jan', count: 1 },
      { month: 'Feb', count: 2 },
      { month: 'Mar', count: 0 },
      { month: 'Apr', count: 1 },
      { month: 'May', count: 3 }
    ]],
    ['2', [
      { month: 'Jan', count: 2 },
      { month: 'Feb', count: 1 },
      { month: 'Mar', count: 2 },
      { month: 'Apr', count: 3 },
      { month: 'May', count: 1 }
    ]],
    ['3', [
      { month: 'Jan', count: 0 },
      { month: 'Feb', count: 1 },
      { month: 'Mar', count: 1 },
      { month: 'Apr', count: 2 },
      { month: 'May', count: 2 }
    ]]
  ]);

  constructor(private http: HttpClient) { }

  // Récupérer les statistiques générales
  getStats(): Observable<Stats> {
    // Pour un environnement de production, utilisez:
    // return this.http.get<Stats>(`${this.apiUrl}/stats`);
    
    // Pour les tests, retournez les données fictives
    return of(this.mockStats);
  }

  // Récupérer la liste des médecins
  getDoctors(): Observable<Doctor[]> {
    // Pour un environnement de production, utilisez:
    // return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`);
    
    // Pour les tests, retournez les données fictives
    return of(this.mockDoctors);
  }

  // Récupérer la liste des patients
  getPatients(): Observable<Patient[]> {
    // Pour un environnement de production, utilisez:
    // return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
    
    // Pour les tests, retournez les données fictives
    return of(this.mockPatients);
  }

  // Récupérer les rendez-vous d'un médecin spécifique
  getDoctorAppointments(doctorId: string): Observable<DoctorAppointment[]> {
    // Pour un environnement de production, utilisez:
    // return this.http.get<DoctorAppointment[]>(`${this.apiUrl}/doctors/${doctorId}/appointments`);
    
    // Pour les tests, retournez les données fictives
    return of(this.mockDoctorAppointments.get(doctorId) || []);
  }

  // Récupérer les rendez-vous d'un patient spécifique
  getPatientAppointments(patientId: string): Observable<PatientAppointment[]> {
    // Pour un environnement de production, utilisez:
    // return this.http.get<PatientAppointment[]>(`${this.apiUrl}/patients/${patientId}/appointments`);
    
    // Pour les tests, retournez les données fictives
    return of(this.mockPatientAppointments.get(patientId) || []);
  }
}