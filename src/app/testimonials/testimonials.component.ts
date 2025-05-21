import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Interface pour typer les témoignages
interface Testimonial {
  _id?: string;
  name: string;
  subtitle: string;
  content: string;
}


@Component({
  selector: 'app-testimonials',
  standalone: false,
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  // Tableau pour stocker les témoignages de la base de données
  testimonials: Testimonial[] = [];
  
  // Variables pour gérer l'état de chargement
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  // Index du témoignage actuel à afficher
  currentTestimonialIndex = 0;

  // Témoignages par défaut (seront utilisés en cas d'erreur ou pour les tests)
  defaultTestimonials = [
    {
      id: 1,
      name: 'Morijorch',
      subtitle: 'Default model text',
      content: "exellent website with flexebility"
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

  // Injectez HttpClient pour les requêtes API
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Charger les témoignages depuis la base de données quand le composant s'initialise
    this.loadTestimonialsFromDatabase();
  }

  // Méthode pour charger les témoignages depuis l'API
  loadTestimonialsFromDatabase(): void {
  const apiUrl = 'http://localhost:5000/api/testimonials'; 
  
  this.isLoading = true;
  
  this.http.get<{ success: boolean; testimonials: Testimonial[] }>(apiUrl).subscribe({
    next: (response) => {
      if (response.success && response.testimonials && response.testimonials.length > 0) {
        this.testimonials = response.testimonials;
      } else {
        this.testimonials = this.defaultTestimonials;
        console.warn('Aucun témoignage trouvé dans la base de données. Utilisation des témoignages par défaut.');
      }
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Erreur lors du chargement des témoignages:', error);
      this.hasError = true;
      this.errorMessage = 'Impossible de charger les témoignages. Utilisation des données par défaut.';
      this.testimonials = this.defaultTestimonials;
      this.isLoading = false;
    }
  });
}


  // Getter pour obtenir le témoignage actuellement affiché
  get currentTestimonial() {
    return this.testimonials[this.currentTestimonialIndex];
  }

  // Navigation vers le témoignage précédent
  previousTestimonial(): void {
    if (this.currentTestimonialIndex > 0) {
      this.currentTestimonialIndex--;
    } else {
      this.currentTestimonialIndex = this.testimonials.length - 1;
    }
  }

  // Navigation vers le témoignage suivant
  nextTestimonial(): void {
    if (this.currentTestimonialIndex < this.testimonials.length - 1) {
      this.currentTestimonialIndex++;
    } else {
      this.currentTestimonialIndex = 0;
    }
  }
}