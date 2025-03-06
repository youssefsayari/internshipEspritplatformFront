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
import { GraduationInternshipComponent } from '../../components/internship/graduation-internship/graduation-internship.component';
import { SummerInternshipComponent} from "../../components/internship/summer-internship/summer-internship.component";
import {QuizListComponent } from '../../components/quiz-list/quiz-list.component';
import { AddQuizComponent } from '../../components/add-quiz/add-quiz.component';
import { AddQuestionsComponent } from '../../components/add-questions/add-questions.component';
import { QuizDetailsComponent } from '../../quiz-details/quiz-details.component';
import { QuizEditComponent } from '../../quiz-edit/quiz-edit.component';
import { QuizListUserComponent } from '../../quiz-list-user/quiz-list-user.component';
import { QuizPassComponent } from '../../quiz-pass/quiz-pass.component';



export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },

    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    {path:'quiz-list',        component:QuizListComponent},
    {path:'quiz-list-user',        component:QuizListUserComponent},

    {path:'add-quiz',        component:AddQuizComponent},
    {path:'add-questions/:id',        component:AddQuestionsComponent},
    { path: 'quiz-details/:id', component: QuizDetailsComponent },
    { path: 'quiz-edit/:id', component: QuizEditComponent }, 
    { path: 'quiz/:id', component: QuizPassComponent },
 




    { path: 'internship',        component: InternshipComponent,
    children: [
    { path: 'summer-internship', component: SummerInternshipComponent },
    { path: 'graduation-internship', component: GraduationInternshipComponent }]},
    
    { path: 'agreement',        component: AgreementComponent }
];
