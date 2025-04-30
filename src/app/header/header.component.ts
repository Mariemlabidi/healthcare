import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  logoText = 'WeCare';
  navItems = [
    { name: 'Find A Doctor', link: '/doctors' },
    { name: 'Our Services', link: '/services' },
    { name: 'Testimonials', link: '/testimonial' }
  ];
}
