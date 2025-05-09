// services/doctor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doctor } from '../../models/doctor.model';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) { }

  // Récupérer tous les médecins
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  // Récupérer un médecin par son ID
  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un nouveau médecin
  addDoctor(doctorData: FormData): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, doctorData);
  }

  // Mettre à jour un médecin existant
  updateDoctor(id: number, doctorData: FormData): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, doctorData);
  }

  // Supprimer un médecin
  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}