import { Component, OnInit } from '@angular/core';
import { MeetingComponent } from '../meeting/meeting.component';

import {UserService} from "../../services/user.service";

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles: string[];
}
export const ROUTES: RouteInfo[] = [
    //AMEN
    { path: '/My meeting', title: 'My Meeting', icon: 'education_atom', class: '' },
    { path: '/StudentMeeting', title: 'StudentMeeting', icon: 'education_atom', class: '' },

   

  { path: '/dashboard', title: 'Dashboard', icon: 'business_chart-bar-32', class: '', roles: ['Admin'] },
  { path: '/user-profile', title: 'My Profile', icon: 'users_single-02', class: '', roles: ['Student', 'Tutor','Company'] },
  { path: '/student', title: 'Students', icon: 'education_glasses', class: '', roles: ['Admin'] },
  { path: '/post', title: 'Posts', icon: 'education_paper', class: '', roles: ['Admin'] },
  { path: '/internship-request', title: 'Internship Request', icon: 'education_paper', class: '', roles: ['Company'] },
  { path: '/agreement', title: 'My Agreement', icon: 'education_paper', class: '', roles: ['Student'] },
  { path: '/internship', title: 'My Internship', icon: 'business_briefcase-24', class: '', roles: ['Student'] },
  { path: '/internship', title: 'Internship', icon: 'business_briefcase-24', class: '', roles: ['Tutor'] },
  { path: '/document', title: 'My Documents', icon: 'files_single-copy-04', class: '', roles: ['Student', 'Admin'] },
  { path: '/meeting', title: 'My Meetings', icon: 'ui-1_calendar-60', class: '', roles: ['Student', 'Admin','Company'] },
  { path: '/task', title: 'My Tasks', icon: 'design_vector', class: '', roles: ['Student', 'Admin'] },
  { path: '/quiz', title: 'My Quizzes', icon: 'ui-2_chat-round', class: '', roles: ['Student','Company'] },
  { path: '/defence', title: 'My Defences', icon: 'education_hat', class: '', roles: ['Student'] },
  { path: '/setting', title: 'Settings', icon: 'ui-1_settings-gear-63', class: '', roles: ['Admin'] },
  { path: '/feedback', title: 'Feedback', icon: 'ui-1_send', class: 'active active-pro', roles: ['Student','Admin','Company'] },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] = [];
  userRole: string = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    const token = localStorage.getItem('Token');
    this.userService.decodeTokenRole(token).subscribe({
      next: (userDetails) => {
        this.userRole = userDetails.role;
        this.menuItems = ROUTES.filter(menuItem => menuItem.roles.includes(this.userRole));
      },
      error: (err) => {
        console.error("Error fetching user role:", err);
        this.userRole = 'Unknown';
      }
    });
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
