import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentFormComponent} from './appointment-form/appointment-form.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';
import { RegistreComponent } from './registre/registre.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';



const routes: Routes = [ 
  { path: '', component: HomeComponent },
  {path:'login' , component:LoginComponent},
  { path: 'appointment', component: AppointmentFormComponent },
  { path: 'map', component:MapComponent  },
  { path: 'register', component: RegistreComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
