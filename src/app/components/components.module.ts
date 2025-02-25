import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
<<<<<<< Updated upstream
=======
import { NotfoundComponent } from './notfound/notfound.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizPassComponent } from './quiz-pass/quizpass.component';
>>>>>>> Stashed changes

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
<<<<<<< Updated upstream
    SidebarComponent
=======
    SidebarComponent,
    NotfoundComponent,
    QuizListComponent,
    QuizPassComponent
>>>>>>> Stashed changes
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class ComponentsModule { }
