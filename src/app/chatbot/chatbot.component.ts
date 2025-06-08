// chatbot.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatbotService, ChatMessage } from '../chatbot.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  standalone:false,
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage = '';
  isOpen = false;
  isLoading = false;
  
  private subscriptions: Subscription[] = [];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // S'abonner aux messages
    this.subscriptions.push(
      this.chatbotService.messages$.subscribe(messages => {
        this.messages = messages;
      })
    );

    // S'abonner à l'état d'ouverture du chatbot
    this.subscriptions.push(
      this.chatbotService.chatbotOpen$.subscribe(isOpen => {
        this.isOpen = isOpen;
      })
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  sendMessage() {
    if (this.newMessage.trim() && !this.isLoading) {
      const message = this.newMessage.trim();
      this.newMessage = '';
      this.isLoading = true;

      this.chatbotService.sendMessage(message).subscribe({
        next: (response) => {
          this.chatbotService.addMessage(response.reply, false);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.chatbotService.addMessage('Désolé, une erreur s\'est produite. Veuillez réessayer.', false);
          this.isLoading = false;
        }
      });
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  closeChatbot() {
    this.chatbotService.closeChatbot();
  }

  clearChat() {
    this.chatbotService.clearMessages();
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Erreur scroll:', err);
    }
  }
}

