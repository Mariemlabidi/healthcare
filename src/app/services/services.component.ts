import { Component } from '@angular/core';

interface Service {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-services',
  standalone:false,
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services: Service[] = [
    {
      icon: 'fas fa-stethoscope',
      title: 'Specialised Service',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      color: '#f8d7cf'
    },
    {
      icon: 'fas fa-comments',
      title: '24/7 Advanced Care',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      color: '#cce8d9'
    },
    {
      icon: 'fas fa-file-medical',
      title: 'Get Result Online',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      color: '#d8e1f3'
    }
  ];
}
