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
import { ServicesComponent } from './provided-services/services.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { HomeComponent } from './home/home.component';
import { MySwiperComponent } from './my-swiper/my-swiper.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { MapComponent } from './map/map.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { ContactComponent } from './contact/contact.component';
import { WhyChooseUsComponent } from './why-choose-us/why-choose-us.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { AuthGuard } from './auth.guard';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { AdminDoctorsComponent } from './admin-doctors/admin-doctors.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { ChatbotComponent } from './chatbot/chatbot.component';






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
    MySwiperComponent,
    DoctorsComponent,
    MapComponent,
    TestimonialsComponent,
    ContactComponent,
    WhyChooseUsComponent,
    LoginComponent,
    RegisterComponent,
    AdminDoctorsComponent,
    AdminDashboardComponent,
    ClientAppointmentsComponent,
    ClientAppointmentsComponent,
    ChatbotComponent,
  
  
  ],
  imports: [
    
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      
      { path: '', component: HomeComponent },  
      { path: 'appointment', component: AppointmentFormComponent },
      { path: 'map', component:MapComponent  },
      { path: 'testimonial', component:TestimonialsComponent },
      { path: 'services', component:ServicesComponent  },
      { path: 'doctors', component:DoctorsComponent  },
      {path:'login' , component:LoginComponent},
      { path: 'register', component: RegisterComponent },
      {path:'admin-doctors',component:AdminDoctorsComponent},
      {path:'admin-dashboard' , component:AdminDashboardComponent},
      {path:'client-appointment',component:ClientAppointmentsComponent}
      

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

