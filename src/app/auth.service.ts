import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInStatus = false;

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      this.isLoggedInStatus = true;
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify({  email,password, role: 'patient' }));

      return true;
    }
    return false;
  }

  register(user: any): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: any) => u.email === user.email)) return false;
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  logout(): void {
    this.isLoggedInStatus = false;
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
  

}
