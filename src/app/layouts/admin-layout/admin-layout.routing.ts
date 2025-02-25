import { Routes } from '@angular/router';

<<<<<<< Updated upstream
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
=======
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
import { QuizPassComponent} from '../../components/quiz-pass/quizpass.component';


>>>>>>> Stashed changes

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },

    { path: 'notifications',  component: NotificationsComponent },
<<<<<<< Updated upstream
    { path: 'upgrade',        component: UpgradeComponent }
=======
    { path: 'upgrade',        component: UpgradeComponent },
    {path:'quiz-list',        component:QuizListComponent},
    { path: 'quiz/:id', component: QuizPassComponent },
    { path: 'internship',        component: InternshipComponent,
    children: [
    { path: 'summer-internship', component: SummerInternshipComponent },
    { path: 'graduation-internship', component: GraduationInternshipComponent }]},
    
    { path: 'agreement',        component: AgreementComponent }
>>>>>>> Stashed changes
];
