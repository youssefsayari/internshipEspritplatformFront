import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';



import { ActivityTimelineComponent } from './activity-timeline/activity-timeline.component';
import { MyContactsComponent } from './my-contacts/my-contacts.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,

    ActivityTimelineComponent,
    MyContactsComponent,
    ProfileCardComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,

    ActivityTimelineComponent, // Ajout pour pouvoir l'utiliser ailleurs
    MyContactsComponent,
    ProfileCardComponent
  ]
})
export class ComponentsModule { }
