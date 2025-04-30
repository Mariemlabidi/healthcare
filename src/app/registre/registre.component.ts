import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registre',
  standalone: false,
  templateUrl: './registre.component.html',
  styleUrl: './registre.component.css'
})
export class RegistreComponent {

  email = '';
  password = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const success = this.auth.register({ email: this.email, password: this.password });
    this.message = success ? 'Registration successful!' : 'User already exists';
    if (success) this.router.navigate(['/']);
  }

}
