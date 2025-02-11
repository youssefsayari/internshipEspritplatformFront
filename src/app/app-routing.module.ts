import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { EventsComponent } from './components/events/events.component'; // Assure-toi d'importer le bon composant

// Définir les routes
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard', // Route par défaut
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'events', component: EventsComponent }, // Route vers EventsComponent
      // Ajoute d'autres routes ici si nécessaire, par exemple '/dashboard', '/user-profile', etc.
    ]
  },
  {
    path: '**', // Route pour les URL non définies
    redirectTo: 'dashboard' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
