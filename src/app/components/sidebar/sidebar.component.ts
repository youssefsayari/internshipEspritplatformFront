import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/user-profile', title: 'My Profile',  icon:'users_single-02', class: '' },
    { path: '/agreement', title: 'My Agreement',  icon:'education_paper', class: '' },
    { path: '/internship', title: 'My Internship',  icon:'business_briefcase-24', class: '' },
    { path: '/document', title: 'My Documents',  icon:'files_single-copy-04', class: '' },
    { path: '/meeting', title: 'My Meetings',  icon:'ui-1_calendar-60', class: '' },
    { path: '/task', title: 'My Tasks',  icon:'design_vector', class: '' },
    { path: '/quiz-list', title: 'My Quizzes',  icon:'ui-2_chat-round', class: '' },
    { path: '/defence', title: 'My Defences',  icon:'education_hat', class: '' },
    { path: '/feedback', title: 'Feed Back',  icon:'ui-1_send', class: 'active active-pro' }

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
