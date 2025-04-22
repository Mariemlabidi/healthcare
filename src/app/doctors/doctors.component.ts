import { Component, OnInit } from '@angular/core';

interface Doctor {
  id: number;
  name: string;
  title: string;
  image: string;
}

@Component({
  selector: 'app-doctors',
  standalone: false,
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor2.jpg'
    },
    {
      id: 3,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor3.jpg'
    },
    {
      id: 4,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor4.jpg'
    }
  ];

  currentSlide = 0;
  totalSlides = this.doctors.length;
  
  constructor() { }

  ngOnInit(): void {
    // Vous pouvez ajouter un carrousel automatique ici si souhaité
    // this.startAutoSlide();
  }

  // Méthode pour aller à une diapositive spécifique
  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  // Méthode pour aller à la diapositive suivante
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  // Méthode pour aller à la diapositive précédente
  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }

  // Méthode optionnelle pour lancer le défilement automatique
  startAutoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000); // Change de diapositive toutes les 5 secondes
  }
}
