import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  // Cette méthode pourrait être utilisée pour obtenir des données spécifiques à un rôle
  // par exemple des données pour le tableau de bord d'un médecin
  getMedecinData(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/auth/medecin`);
  }

  // Méthode pour obtenir des données spécifiques au rôle client
  getClientData(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/auth/client`);
  }

  // Méthode pour obtenir des données spécifiques au rôle admin
  getAdminData(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/auth/admin`);
  }
}