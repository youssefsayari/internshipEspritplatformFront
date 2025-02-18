import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { MeetingComponent } from '../../components/meeting/meeting.component';
import { TasksListComponent } from '../../components/tasks/tasks-list/tasks-list.component';

export const AdminLayoutRoutes: Routes = [
   
    { path: 'My meeting',        component: MeetingComponent },
    { path: 'My Students',        component: TasksListComponent },
    { path: 'My internships',      component: DashboardComponent },
    { path: 'My defenses',   component: UserProfileComponent },
    { path: 'feedback',     component: TableListComponent },
   


    


];
