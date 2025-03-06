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
import { FullCalendarModule } from '@fullcalendar/angular';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './components/login/login.component';
import { AddQuizComponent } from './components/add-quiz/add-quiz.component';
import { AddQuestionsComponent } from './components/add-questions/add-questions.component';
import { QuizDetailsComponent } from './quiz-details/quiz-details.component';
import { QuizEditComponent } from './quiz-edit/quiz-edit.component';
import { QuizListUserComponent } from './quiz-list-user/quiz-list-user.component';
import { QuizPassComponent } from './quiz-pass/quiz-pass.component';


import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import { DocumentComponent } from './document/document.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DefenseComponent } from './defense/defense.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { PredefinedDocumentsComponent } from './predefined-documents/predefined-documents.component';
import { GenerateCvComponent } from './generate-cv/generate-cv.component';
import { AddDocumentComponent } from './add-document/add-document.component';



@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule,
    DragDropModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    NgxPaginationModule,


    ToastrModule.forRoot(),
    ReactiveFormsModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    DocumentComponent,
    DocumentListComponent,
    DefenseComponent,
    DocumentDetailsComponent,
    PredefinedDocumentsComponent,
    GenerateCvComponent,
    AddDocumentComponent,
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
