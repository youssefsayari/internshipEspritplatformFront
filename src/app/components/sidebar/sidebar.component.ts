import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/Posts', title: 'Post Management',  icon:'education_atom', class: '' },
    { path: '/maps', title: 'Company Management',  icon:'location_map-big', class: '' },
    { path: '/notifications', title: 'Internship Management',  icon:'ui-1_bell-53', class: '' },

    { path: '/user-profile', title: 'Convention Management',  icon:'users_single-02', class: '' },
    { path: '/table-list', title: 'Task Management',  icon:'design_bullet-list-67', class: '' },
    { path: '/typography', title: 'Defense Management',  icon:'text_caps-small', class: '' },
   // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'objects_spaceship', class: 'active active-pro' }
   { path: '/upgrade', title: 'Make a Claim',  icon:'objects_spaceship', class: 'active ' }

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
