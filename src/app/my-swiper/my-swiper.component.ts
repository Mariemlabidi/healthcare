import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-my-swiper',
  standalone: false,
  templateUrl: './my-swiper.component.html',
  styleUrls: ['./my-swiper.component.css']
})
export class MySwiperComponent implements AfterViewInit {
  
  services = [
    {
      icon: 'fa-solid fa-tooth',
      title: 'Dental Care',
      description: 'Lorem ipsum dolor sit amet consectetur'
    },
    {
      icon: 'fa-solid fa-stethoscope',
      title: 'Medical Check-up',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit'
    },
    {
      icon: 'fa-solid fa-heart-pulse',
      title: 'Cardiology',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor'
    },
    {
      icon: 'fa-solid fa-brain',
      title: 'Neurology',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit'
    }
  ];

  ngAfterViewInit() {
    // Initialize Swiper
    Swiper.use([Navigation, Pagination]);
    
    const swiper = new Swiper('.mySwiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }
    });
  }
}