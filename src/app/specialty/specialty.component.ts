import { Component } from '@angular/core';


interface Specialty {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}

@Component({
  selector: 'app-specialty',
  standalone: false,
 
  templateUrl: './specialty.component.html',
  styleUrls: ['./specialty.component.css']
})
export class SpecialtyComponent {
  specialties: Specialty[] = [
    {
      icon: 'dental',
      title: 'Dental Care',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem ullam perspiciatis impedit consequuntur',
      bgColor: 'bg-blue-50'
    },
    {
      icon: 'eye',
      title: 'Eye Care',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem ullam perspiciatis impedit consequuntur',
      bgColor: 'bg-green-50'
    },
    {
      icon: 'skin',
      title: 'Skin Care',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem ullam perspiciatis impedit consequuntur',
      bgColor: 'bg-red-50'
    }
  ];

  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.specialties.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.specialties.length) % this.specialties.length;
  }
}