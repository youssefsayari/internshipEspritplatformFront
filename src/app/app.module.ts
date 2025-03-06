import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule,FormGroup} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';



import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './components/login/login.component';
import { AddQuizComponent } from './components/add-quiz/add-quiz.component';
import { AddQuestionsComponent } from './components/add-questions/add-questions.component';
import { QuizDetailsComponent } from './quiz-details/quiz-details.component';
import { QuizEditComponent } from './quiz-edit/quiz-edit.component';
import { QuizListUserComponent } from './quiz-list-user/quiz-list-user.component';
import { QuizPassComponent } from './quiz-pass/quiz-pass.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    NgxPaginationModule ,// Add this to your imports
    

    ToastrModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    AddQuizComponent,
    AddQuestionsComponent,
    QuizDetailsComponent,
    QuizEditComponent,
    QuizListUserComponent,
    QuizPassComponent,
    


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
