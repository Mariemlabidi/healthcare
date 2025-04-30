import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
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

    // Afficher les données du formulaire
    console.log('SUCCESS', this.contactForm.value);
    
    // Simulation de l'envoi réussi
    this.success = true;
    
    // Réinitialiser le formulaire après soumission réussie
    setTimeout(() => {
      this.contactForm.reset();
      this.submitted = false;
      this.success = false;
    }, 3000);
  }
}