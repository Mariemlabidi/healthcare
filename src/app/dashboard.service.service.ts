import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Doctor, Patient, Stats } from '../models/dashboard.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('DashboardService initialized with baseUrl:', this.baseUrl);
  }

  // Fonction utilitaire pour gérer les erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Options HTTP avec en-têtes
  private getHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // Récupère les statistiques générales
  getStats(): Observable<Stats> {
    console.log('Calling getStats API:', `${this.baseUrl}/dashboard/stats`);
    return this.http.get<Stats>(`${this.baseUrl}/dashboard/stats`, this.getHttpOptions())
      .pipe(
        tap(response => console.log('Stats API response:', response)),
        catchError(this.handleError)
      );
  }

  // Récupère la liste des médecins
  getDoctors(): Observable<Doctor[]> {
    console.log('Calling getDoctors API:', `${this.baseUrl}/dashboard/doctors`);
    return this.http.get<Doctor[]>(`${this.baseUrl}/dashboard/doctors`, this.getHttpOptions())
      .pipe(
        tap(response => {
          console.log('Doctors API response:', response);
          if (!Array.isArray(response)) {
            console.warn('La réponse API des médecins n\'est pas un tableau:', response);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Récupère la liste des patients
  getPatients(): Observable<Patient[]> {
    console.log('Calling getPatients API:', `${this.baseUrl}/dashboard/patients`);
    return this.http.get<Patient[]>(`${this.baseUrl}/dashboard/patients`, this.getHttpOptions())
      .pipe(
        tap(response => {
          console.log('Patients API response:', response);
          if (!Array.isArray(response)) {
            console.warn('La réponse API des patients n\'est pas un tableau:', response);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Récupère les rendez-vous pour un médecin spécifique
  getDoctorAppointments(doctorId: string): Observable<{ date: string, count: number }[]> {
    console.log('Calling getDoctorAppointments API:', `${this.baseUrl}/dashboard/doctor/${doctorId}/appointments`);
    return this.http.get<{ date: string, count: number }[]>(
      `${this.baseUrl}/dashboard/doctor/${doctorId}/appointments`, 
      this.getHttpOptions()
    ).pipe(
      tap(response => console.log('Doctor appointments API response:', response)),
      catchError(this.handleError)
    );
  }

  // Récupère les rendez-vous pour un patient spécifique
  getPatientAppointments(patientId: string): Observable<{ month: string, count: number }[]> {
    console.log('Calling getPatientAppointments API:', `${this.baseUrl}/dashboard/patient/${patientId}/appointments`);
    return this.http.get<{ month: string, count: number }[]>(
      `${this.baseUrl}/dashboard/patient/${patientId}/appointments`, 
      this.getHttpOptions()
    ).pipe(
      tap(response => console.log('Patient appointments API response:', response)),
      catchError(this.handleError)
    );
  }
}