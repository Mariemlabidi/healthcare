import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: false,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  heroHeading = 'Feel Better About Finding HealthCare';
  heroText = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id, vitae ex! Fuga similique repudiandae molestiae libero.';
}