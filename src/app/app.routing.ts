import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {NotfoundComponent} from "./components/notfound/notfound.component";
import {LoginComponent} from "./components/login/login.component";
import { MeetingComponent } from './components/meeting/meeting.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { ImageComponent } from './components/image/image.component';









const routes: Routes =[
  { path: 'login', component: LoginComponent },
  { path: 'add-company', component: AddCompanyComponent },
  { path: 'upload', component: ImageComponent },

  {path: '', redirectTo: '/user-profile', pathMatch: 'full',},

  {path: '', component: AdminLayoutComponent, children: [{path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(x=>x.AdminLayoutModule)
  }]},
  {path: '**', component:NotfoundComponent},

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
