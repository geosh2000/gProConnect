import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { GproComponent } from './gpro.component';
import { HomeComponent } from './home/home.component';
// import { AuthGuard } from 'src/app/guard/auth.guard';


const childRoutes: Routes = [
  { 
    path: '', 
    component: HomeComponent ,
    // canActivate: [ AuthGuard ],
    data: { title: 'G-Pro Connect by Geosh Global', role: 'public' } 
  }
]



@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
