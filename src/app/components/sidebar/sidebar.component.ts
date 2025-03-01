import { Component, OnInit } from '@angular/core';
import { MeetingComponent } from '../meeting/meeting.component';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    /*{ path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/meeting', title: 'Meeting',  icon:'education_atom', class: '' },
    { path: '/tasks', title: 'Tasks',  icon:'location_map-big', class: '' },



    { path: '/icons', title: 'Icons',  icon:'education_atom', class: '' },
    { path: '/maps', title: 'Maps',  icon:'location_map-big', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'ui-1_bell-53', class: '' },

    { path: '/user-profile', title: 'User Profile',  icon:'users_single-02', class: '' },
    { path: '/table-list', title: 'Table List',  icon:'design_bullet-list-67', class: '' },
    { path: '/typography', title: 'Typography',  icon:'text_caps-small', class: '' },
    { path: '/upgrade', title: 'Upgrade to PRO',  icon:'objects_spaceship', class: 'active active-pro' }*/
    { path: '/My meeting', title: 'My Meeting', icon: 'education_atom', class: '' },
    { path: '/StudentMeeting', title: 'StudentMeeting', icon: 'education_atom', class: '' },

    { path: '/My Students', title: 'My Students', icon: 'location_map-big', class: '' },
    { path: '/My internships', title: 'My Internships', icon: 'business_briefcase-24', class: '' },
    { path: '/My defenses', title: 'My Defenses', icon: 'design_app', class: '' },
    { path: '/feedback', title: 'Feedback', icon: 'ui-1_bell-53', class: '' },

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
