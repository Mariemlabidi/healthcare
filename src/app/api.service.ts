import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api/book_appointement';

  constructor(private http: HttpClient) {}

  getHello(): Observable<any> {
    return this.http.get(`${this.baseUrl}/hello`);
  }
}
