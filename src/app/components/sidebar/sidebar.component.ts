import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles: string[];
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'business_chart-bar-32', class: '', roles: ['Admin'] },
  { path: '/student', title: 'Students', icon: 'education_glasses', class: '', roles: ['Admin'] },
  { path: '/user-profile', title: 'My Profile', icon: 'users_single-02', class: '', roles: ['Student', 'Admin'] },
  { path: '/agreement', title: 'My Agreement', icon: 'education_paper', class: '', roles: ['Student'] },
  { path: '/internship', title: 'My Internship', icon: 'business_briefcase-24', class: '', roles: ['Student','Tutor'] },
  { path: '/document', title: 'My Documents', icon: 'files_single-copy-04', class: '', roles: ['Student', 'Admin'] },
  { path: '/meeting', title: 'My Meetings', icon: 'ui-1_calendar-60', class: '', roles: ['Student', 'Admin'] },
  { path: '/task', title: 'My Tasks', icon: 'design_vector', class: '', roles: ['Student', 'Admin'] },
  { path: '/quiz', title: 'My Quizzes', icon: 'ui-2_chat-round', class: '', roles: ['Student'] },
  { path: '/defence', title: 'My Defences', icon: 'education_hat', class: '', roles: ['Student'] },
  { path: '/feedback', title: 'Feedback', icon: 'ui-1_send', class: 'active active-pro', roles: ['Student','Admin'] }
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
