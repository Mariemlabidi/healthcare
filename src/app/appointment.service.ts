import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Appointment, AppointmentResponse } from '../models/appointment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Get the authenticated user's appointments
  getUserAppointments(): Observable<AppointmentResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<AppointmentResponse>(`${this.apiUrl}/me/my-appointments`, { headers });
  }

  // Cancel an appointment
  cancelAppointment(appointmentId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/${appointmentId}/cancel`, {}, { headers });
  }

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }
}