import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HeroComponent } from './hero/hero.component';
import { SearchComponent } from './search/search.component';
import { ServicesComponent } from './services/services.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroComponent,
    SearchComponent,
    ServicesComponent,
    SpecialtyComponent,
    AppointmentFormComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      
      { path: '', component: HomeComponent },  // Changer pour HomeComponent au lieu de AppComponent
      // Ajouter une route pour le formulaire si nécessaire
      { path: 'appointment', component: AppointmentFormComponent },
      
      // Add more routes as needed
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

