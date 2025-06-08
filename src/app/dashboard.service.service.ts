import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
      
      // Log détaillé pour le debugging
      console.error('Détails de l\'erreur HTTP:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error
      });
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Options HTTP avec en-têtes
  private getHttpOptions() {
    const token = sessionStorage.getItem('token');
    console.log('Token présent:', !!token);
    
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  // Récupère les statistiques générales
  getStats(): Observable<Stats> {
    const url = `${this.baseUrl}/dashboard/stats`;
    console.log('Calling getStats API:', url);
    
    return this.http.get<Stats>(url, this.getHttpOptions())
      .pipe(
        tap(response => console.log('Stats API response:', response)),
        catchError(this.handleError)
      );
  }

  // Récupère la liste des médecins avec validation
  getDoctors(): Observable<Doctor[]> {
    const url = `${this.baseUrl}/dashboard/doctors`;
    console.log('Calling getDoctors API:', url);
    
    return this.http.get<any>(url, this.getHttpOptions())
      .pipe(
        tap(response => {
          console.log('Raw doctors API response:', response);
          console.log('Response type:', typeof response);
          console.log('Is array:', Array.isArray(response));
        }),
        map(response => {
          // S'assurer que la réponse est un tableau
          if (Array.isArray(response)) {
            return response as Doctor[];
          } else if (response && response.data && Array.isArray(response.data)) {
            // Cas où la réponse est encapsulée dans un objet
            return response.data as Doctor[];
          } else {
            console.warn('Format de réponse inattendu pour les médecins:', response);
            return [];
          }
        }),
        tap(doctors => {
          console.log(`Processed ${doctors.length} doctors:`, doctors);
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération des médecins:', error);
          // Retourner un tableau vide en cas d'erreur
          return of([]);
        })
      );
  }

  // Récupère la liste des patients avec validation
  getPatients(): Observable<Patient[]> {
    const url = `${this.baseUrl}/dashboard/patients`;
    console.log('Calling getPatients API:', url);
    
    return this.http.get<any>(url, this.getHttpOptions())
      .pipe(
        tap(response => {
          console.log('Raw patients API response:', response);
        }),
        map(response => {
          // S'assurer que la réponse est un tableau
          if (Array.isArray(response)) {
            return response as Patient[];
          } else if (response && response.data && Array.isArray(response.data)) {
            return response.data as Patient[];
          } else {
            console.warn('Format de réponse inattendu pour les patients:', response);
            return [];
          }
        }),
        tap(patients => {
          console.log(`Processed ${patients.length} patients:`, patients);
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération des patients:', error);
          return of([]);
        })
      );
  }

  // Récupère les rendez-vous pour un médecin spécifique
  getDoctorAppointments(doctorId: string): Observable<{ date: string, count: number }[]> {
    const url = `${this.baseUrl}/dashboard/doctors/${doctorId}/appointments`;
    console.log('Calling getDoctorAppointments API:', url);
    
    return this.http.get<{ date: string, count: number }[]>(url, this.getHttpOptions())
      .pipe(
        tap(response => console.log('Doctor appointments API response:', response)),
        catchError(this.handleError)
      );
  }

  // Récupère les rendez-vous pour un patient spécifique
  getPatientAppointments(patientId: string): Observable<{ month: string, count: number }[]> {
    const url = `${this.baseUrl}/dashboard/patients/${patientId}/appointments`;

    console.log('Calling getPatientAppointments API:', url);
    
    return this.http.get<{ month: string, count: number }[]>(url, this.getHttpOptions())
      .pipe(
        tap(response => console.log('Patient appointments API response:', response)),
        catchError(this.handleError)
      );
  }
}