import { Component, AfterViewInit, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { HttpClient } from '@angular/common/http';

interface Doctor {
  _id: string;
  name: string;
  title: string;
  image: string;
  address: string; 
}

@Component({
  selector: 'app-doctors',
  standalone: false,
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit, AfterViewInit {

  doctors: Doctor[] = [];
  loading: boolean = true;
  error: string | null = null;
  
 
  private apiUrl = 'http://localhost:5000/api/doctors'; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.loading = true;
    this.http.get<Doctor[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          this.doctors = data;
          this.loading = false;
          
          // Si le swiper est déjà initialisé, on le met à jour
          setTimeout(() => {
            this.initSwiper();
          }, 100);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des médecins:', err);
          this.error = 'Impossible de charger la liste des médecins.';
          this.loading = false;
        }
      });
  }

  initSwiper(): void {
    Swiper.use([Navigation, Pagination]);

    const swiper = new Swiper('.mySwiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      breakpoints: {
        640: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Si les données sont déjà chargées, on initialise Swiper
    if (!this.loading && this.doctors.length > 0) {
      this.initSwiper();
    }
  }
}