
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chatbot';
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  private chatbotOpenSubject = new BehaviorSubject<boolean>(false);
  public chatbotOpen$ = this.chatbotOpenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Message de bienvenue initial
    this.addMessage("Hello! How can I assist you with your healthcare needs today?", false);
  }

  sendMessage(message: string): Observable<any> {
    // Ajouter le message de l'utilisateur
    this.addMessage(message, true);
    
    // Envoyer à l'API
    return this.http.post(`${this.apiUrl}/ask`, { message });
  }

  addMessage(text: string, isUser: boolean) {
    const currentMessages = this.messagesSubject.value;
    const newMessage: ChatMessage = {
      text,
      isUser,
      timestamp: new Date()
    };
    this.messagesSubject.next([...currentMessages, newMessage]);
  }

  openChatbot() {
    this.chatbotOpenSubject.next(true);
  }

  closeChatbot() {
    this.chatbotOpenSubject.next(false);
  }

  isChatbotOpen(): boolean {
    return this.chatbotOpenSubject.value;
  }

  clearMessages() {
    this.messagesSubject.next([]);
    this.addMessage("Hello! How can I assist you with your healthcare needs today?", false);
  }
}