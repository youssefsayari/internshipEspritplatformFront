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
import { TasksListComponent } from '../../components/tasks/tasks-list/tasks-list.component';
import { StudentMeetingsComponent } from '../../components/Students/student-meetings/student-meetings.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'icons',          component: IconsComponent },
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
];
