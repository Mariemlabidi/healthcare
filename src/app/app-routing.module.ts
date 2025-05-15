import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentFormComponent} from './appointment-form/appointment-form.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import{AdminDoctorsComponent} from './admin-doctors/admin-doctors.component'
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';



const routes: Routes = [ 
  { path: '', component: HomeComponent },
  {path:'login' , component:LoginComponent},
  { path: 'appointment', component: AppointmentFormComponent },
  { path: 'map', component:MapComponent  },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-doctors', component: AdminDoctorsComponent, canActivate: [AuthGuard] },
  {path:'admin-dashboard' , component:AdminDashboardComponent},
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
