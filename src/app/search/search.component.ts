// search.component.ts
import { Component } from '@angular/core';
import { ChatbotService } from '../chatbot.service'; // Ajustez le chemin selon votre structure

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTitle = 'Find Best HealthCare';
  searchQuery = '';
  location = '';

  constructor(private chatbotService: ChatbotService) {}

  // Nouvelle méthode pour gérer le clic sur le champ de recherche
  onSearchFieldClick() {
    this.openChatbotWithContext();
  }

  // Alternative: ouvrir au focus du champ
  onSearchFieldFocus() {
    this.openChatbotWithContext();
  }

  search() {
    console.log('Searching for:', this.searchQuery, 'at', this.location);
    
    if (this.searchQuery.toLowerCase().includes('doctor') ||
        this.searchQuery.toLowerCase().includes('advice') ||
        this.searchQuery.toLowerCase().includes('conseil') ||
        this.searchQuery.toLowerCase().includes('médecin')) {
      
      this.openChatbotWithContext();
    } else {
      this.performNormalSearch();
    }
  }

  openChatbotWithContext() {
    this.chatbotService.openChatbot();
    
    let contextMessage = '';
    if (this.searchQuery && this.location) {
      contextMessage = `I'm looking for ${this.searchQuery} in ${this.location}`;
    } else if (this.searchQuery) {
      contextMessage = `I need help with: ${this.searchQuery}`;
    } else {
      contextMessage = "I need medical advice or want to find a doctor";
    }
    
    setTimeout(() => {
      this.chatbotService.sendMessage(contextMessage).subscribe(
        response => {
          this.chatbotService.addMessage(response.reply, false);
        },
        error => {
          console.error('Erreur chatbot:', error);
          this.chatbotService.addMessage('Sorry, I encountered an error. Please try again.', false);
        }
      );
    }, 500);
  }

  performNormalSearch() {
    console.log('Performing normal search...');
  }

  openChatbot() {
    this.chatbotService.openChatbot();
  }
}