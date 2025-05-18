import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Testimonial } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private apiUrl = `${environment.apiUrl}/testimonials`;
  private testimonialsSubject = new BehaviorSubject<Testimonial[]>([]);
  public testimonials = this.testimonialsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadTestimonials();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  loadTestimonials(): void {
    this.http.get<{ testimonials: Testimonial[] }>(`${this.apiUrl}`)
      .subscribe({
        next: (response) => {
          this.testimonialsSubject.next(response.testimonials);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des témoignages', error);
        }
      });
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.testimonials;
  }

  addTestimonial(testimonial: Testimonial): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.apiUrl}`, testimonial, { headers: this.getHeaders() })
      .pipe(
        tap((newTestimonial: Testimonial) => {
          const currentTestimonials = this.testimonialsSubject.value;
          this.testimonialsSubject.next([...currentTestimonials, newTestimonial]);
        })
      );
  }

  updateTestimonial(id: number, testimonial: Testimonial): Observable<Testimonial> {
    return this.http.put<Testimonial>(`${this.apiUrl}/${id}`, testimonial, { headers: this.getHeaders() })
      .pipe(
        tap((updatedTestimonial: Testimonial) => {
          const currentTestimonials = this.testimonialsSubject.value;
          const updatedTestimonials = currentTestimonials.map(t => 
            t.id === id ? updatedTestimonial : t
          );
          this.testimonialsSubject.next(updatedTestimonials);
        })
      );
  }

  deleteTestimonial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          const currentTestimonials = this.testimonialsSubject.value;
          const filteredTestimonials = currentTestimonials.filter(t => t.id !== id);
          this.testimonialsSubject.next(filteredTestimonials);
        })
      );
  }
}