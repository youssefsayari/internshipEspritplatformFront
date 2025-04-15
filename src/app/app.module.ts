import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatIconModule } from '@angular/material/icon';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentComponent } from './document/document.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DefenseComponent } from './defense/defense.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { PredefinedDocumentsComponent } from './predefined-documents/predefined-documents.component';
import { GenerateCvComponent } from './generate-cv/generate-cv.component';
import { AddDocumentComponent } from './add-document/add-document.component';
import { DefenseListComponent } from './defense-list/defense-list.component';
import { AddDefenseComponent } from './add-defense/add-defense.component';
import { UpdateDefenseComponent } from './update-defense/update-defense.component';
import { DefensesTutorsComponent } from './defenses-tutors/defenses-tutors.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { StudentDefenseComponent } from './student-defense/student-defense.component';
import { DefenseStatsComponent } from './defense-stats/defense-stats.component';
import { TutorCalendarComponent } from './tutor-calendar/tutor-calendar.component';
import { DefenseDetailsComponent } from './defense-details/defense-details.component';
import { EvaluationViewComponent } from './evaluation-view/evaluation-view.component';
import { EvaluationGridPreviewComponent } from './evaluation-grid-preview/evaluation-grid-preview.component';

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
    MatDialogModule,
    MatIconModule
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
    DefenseListComponent,
    AddDefenseComponent,
    UpdateDefenseComponent,
    DefensesTutorsComponent,
    EvaluationFormComponent,
    StudentDefenseComponent,
    DefenseStatsComponent,
    TutorCalendarComponent,
    DefenseDetailsComponent,
    EvaluationViewComponent,
    EvaluationGridPreviewComponent

  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
