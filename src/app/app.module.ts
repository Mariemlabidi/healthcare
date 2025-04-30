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
import { MySwiperComponent } from './my-swiper/my-swiper.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { MapComponent } from './map/map.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { ContactComponent } from './contact/contact.component';
import { WhyChooseUsComponent } from './why-choose-us/why-choose-us.component';
import { LoginComponent } from './login/login.component';
import { RegistreComponent } from './registre/registre.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';



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
    RegistreComponent,
    DashboardComponent 
  ],
  imports: [
    BrowserModule,
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
      { path: 'register', component: RegistreComponent },
        { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

