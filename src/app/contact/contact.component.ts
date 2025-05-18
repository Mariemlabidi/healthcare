import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { TestimonialService } from '../testimonial.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  success = false;
  currentUser: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private testimonialService: TestimonialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });

    // S'abonner aux changements d'utilisateur
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      
      // Si l'utilisateur est connecté, préremplir les champs du formulaire
      if (user) {
        this.contactForm.patchValue({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        });
      }
    });
  }

  // Getters individuels pour chaque contrôle
  get nameControl() { return this.contactForm.get('name'); }
  get phoneControl() { return this.contactForm.get('phone'); }
  get emailControl() { return this.contactForm.get('email'); }
  get messageControl() { return this.contactForm.get('message'); }

  onSubmit() {
    this.submitted = true;

    // Arrêtez-vous ici si le formulaire est invalide
    if (this.contactForm.invalid) {
      return;
    }

    const formData = this.contactForm.value;

    // Créer un nouvel objet témoignage
    const newTestimonial = {
      name: formData.name,
      subtitle: this.currentUser?.role || 'Client',
      content: formData.message
    };

    // Envoyer le témoignage au service
    this.testimonialService.addTestimonial(newTestimonial).subscribe({
      next: (response) => {
        console.log('Témoignage ajouté avec succès', response);
        this.success = true;
        
        // Réinitialiser le formulaire après soumission réussie
        setTimeout(() => {
          // Réinitialiser uniquement le champ message si l'utilisateur est connecté
          if (this.currentUser) {
            this.contactForm.get('message')?.reset();
          } else {
            this.contactForm.reset();
          }
          this.submitted = false;
          this.success = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du témoignage', error);
        // Gérer l'erreur ici (afficher un message à l'utilisateur, etc.)
      }
    });
  }
}