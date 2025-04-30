
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-testimonials',
  standalone:false,
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  testimonials= [
    {
      id: 1,
      name: 'Morijorch',
      subtitle: 'Default model text',
      content:"exellent website with flexebility"
    },
    {
      id: 2,
      name: 'John Doe',
      subtitle: 'Designer',
      content: 'Working with this platform has been an absolute pleasure. Their team is professional, responsive, and delivered exactly what we needed. I would highly recommend their services to anyone looking for quality work.'
    },
    {
      id: 3,
      name: 'Anna Smith',
      subtitle: 'Developer',
      content: 'The attention to detail and commitment to excellence really sets this team apart. They exceeded our expectations and delivered the project ahead of schedule.'
    }
  ];

  currentTestimonialIndex = 0;

  constructor() { }

  ngOnInit(): void {
  }

  get currentTestimonial() {
    return this.testimonials[this.currentTestimonialIndex];
  }
  previousTestimonial(): void {
    if (this.currentTestimonialIndex > 0) {
      this.currentTestimonialIndex--;
    } else {
      this.currentTestimonialIndex = this.testimonials.length - 1;
    }
  }

  nextTestimonial(): void {
    if (this.currentTestimonialIndex < this.testimonials.length - 1) {
      this.currentTestimonialIndex++;
    } else {
      this.currentTestimonialIndex = 0;
    }
  }
}
