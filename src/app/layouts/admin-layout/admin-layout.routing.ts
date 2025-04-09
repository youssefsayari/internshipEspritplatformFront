import { Routes } from '@angular/router';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { TableListComponent } from '../../components/table-list/table-list.component';
import { TypographyComponent } from '../../components/typography/typography.component';
import { IconsComponent } from '../../components/icons/icons.component';
import { MapsComponent } from '../../components/maps/maps.component';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { UpgradeComponent } from '../../components/upgrade/upgrade.component';
import { AgreementComponent } from '../../components/agreement/agreement.component';
import { InternshipComponent } from '../../components/internship/internship.component';
import {PostComponent} from "../../components/post/post.component";
import {StudentComponent} from "../../components/student/student.component";
import {SettingComponent} from "../../components/setting/setting.component";
import { MeetingComponent } from '../../components/meeting/meeting.component';
import { StudentMeetingsComponent } from '../../components/Students/student-meetings/student-meetings.component';
import { DocumentListComponent } from '../../document-list/document-list.component';
import { DocumentComponent } from '../../document/document.component';
import { DefenseComponent } from '../../defense/defense.component';
import { DocumentDetailsComponent } from '../../document-details/document-details.component';
import { PredefinedDocumentsComponent } from '../../predefined-documents/predefined-documents.component';
import { GenerateCvComponent } from '../../generate-cv/generate-cv.component';
import { AddDocumentComponent } from '../../add-document/add-document.component';
import {QuizListComponent } from '../../components/quiz-list/quiz-list.component';
import { AddQuizComponent } from '../../components/add-quiz/add-quiz.component';
import { AddQuestionsComponent } from '../../components/add-questions/add-questions.component';
import { QuizDetailsComponent } from '../../quiz-details/quiz-details.component';
import { QuizEditComponent } from '../../quiz-edit/quiz-edit.component';
import { QuizListUserComponent } from '../../quiz-list-user/quiz-list-user.component';
import { QuizPassComponent } from '../../quiz-pass/quiz-pass.component';
import { TasksListComponent } from '../../components/Students/tasks-list/tasks-list.component';
import { TutorTaskListComponent } from '../../components/Tutors/tutor-task-list/tutor-task-list.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'posts',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },

    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'internship',        component: InternshipComponent},
    { path: 'agreement',        component: AgreementComponent },
    { path: 'post',        component: PostComponent },
    { path: 'student',        component: StudentComponent },
    { path: 'setting',        component: SettingComponent },
    { path: 'internship-request',        component: PostComponent },
      { path: 'MyMeeting',        component: MeetingComponent },
    { path: 'StudentMeeting', component: StudentMeetingsComponent },
    { path: 'MyTasks', component: TasksListComponent },
    {path : "Tasks" , component : TutorTaskListComponent},



    { path: 'document-list', component: DocumentListComponent },
  { path: 'document', component: DocumentComponent },
  { path: 'document-details/:id', component: DocumentDetailsComponent },
  { path: 'defense', component: DefenseComponent },
  { path: 'generate-cv', component: GenerateCvComponent },
  { path: 'add-document', component: AddDocumentComponent },
  { path: 'predefined-documents', component: PredefinedDocumentsComponent },
    {path:'quiz-list',        component:QuizListComponent},
    {path:'quiz-list-user',        component:QuizListUserComponent},

    {path:'add-quiz',        component:AddQuizComponent},
    {path:'add-questions/:id',        component:AddQuestionsComponent},
    { path: 'quiz-details/:id', component: QuizDetailsComponent },
    { path: 'quiz-edit/:id', component: QuizEditComponent },
    { path: 'quiz/:id', component: QuizPassComponent },

];
