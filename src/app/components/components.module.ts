import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MeetingComponent } from './meeting/meeting.component';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { TasksListComponent } from './Students/tasks-list/tasks-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateMeetingComponent } from './update-meeting/update-meeting.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { StudentMeetingsComponent } from './Students/student-meetings/student-meetings.component';
import { StudentAddMeetingComponent } from './Students/student-add-meeting/student-add-meeting.component';
import { StudentUpdateMeetingComponent } from './Students/student-update-meeting/student-update-meeting.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { PostComponent } from './post/post.component';
import { StudentComponent } from './student/student.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import { DialogComponent } from './dialog/dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import { SettingComponent } from './setting/setting.component';
import { DialogInternshipComponent } from './dialog-internship/dialog-internship.component';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import { DialogInternshipTutorComponent } from './dialog-internship-tutor/dialog-internship-tutor.component';
import { DialogRemarkComponent } from './dialog-remark/dialog-remark.component';
import { ActivityTimelineComponent } from './activity-timeline/activity-timeline.component';
import { MyContactsComponent } from './my-contacts/my-contacts.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { IconsComponent } from './icons/icons.component'; // Vérifie le chemin exact
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { AgreementDialogComponent } from './agreement-dialog/agreement-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TutorTaskListComponent } from './Tutors/tutor-task-list/tutor-task-list.component';
import { AddTaskComponent } from './Tutors/add-task/add-task.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { ImageComponent } from './image/image.component';
import { MyProfileCardComponent } from './my-profile-card/my-profile-card.component';
import { GlobeComponent } from './globe/globe.component';




@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FullCalendarModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DragDropModule





  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    MeetingComponent,
    AddMeetingComponent,
    TasksListComponent,
    UpdateMeetingComponent,
    StudentMeetingsComponent,
    StudentAddMeetingComponent,
    StudentUpdateMeetingComponent,
    PostComponent,
    StudentComponent,
    DialogComponent,
    SettingComponent,
    DialogInternshipComponent,
    DialogInternshipTutorComponent,
    DialogRemarkComponent,
    NotfoundComponent,
    ActivityTimelineComponent,
    MyContactsComponent,
    ProfileCardComponent,
    IconsComponent,
    QuizListComponent,
    AgreementDialogComponent,
    TutorTaskListComponent,
    AddTaskComponent,
    AddCompanyComponent,
    ImageComponent,
    MyProfileCardComponent,
    GlobeComponent,
   ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ActivityTimelineComponent, // Ajout pour pouvoir l'utiliser ailleurs
    MyContactsComponent,
    ProfileCardComponent,


  ]
})
export class ComponentsModule { }
