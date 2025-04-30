import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';



interface Doctor {
  id: number;
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
export class DoctorsComponent implements AfterViewInit {

  doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor1.jpg',
      address: 'Clinique Pasteur, Rue Hédi Chaker, Tunis, Tunisia'
    },
    {
      id: 2,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor2.jpg',
      address: 'Tunis, Tunisia'
    },
    {
      id: 3,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor3.jpg',
      address: 'Tunis, Tunisia'
    },
    {
      id: 4,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor4.jpg',
      address: 'Tunisia'
    },
    {
      id: 5,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor4.jpg',
      address: 'Arianna'
    },
    {
      id: 6,
      name: 'Dr. Paradox Alex',
      title: 'Skin Specialist',
      image: 'assets/images/doctor4.jpg',
      address: ' Marsa'
    }
  ];

  ngAfterViewInit(): void {
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



  
}
