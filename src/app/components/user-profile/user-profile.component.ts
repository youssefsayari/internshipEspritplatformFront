import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const userRole = localStorage.getItem('userRole');
    const userClasse = localStorage.getItem('userClasse');
    const token = localStorage.getItem('Token');

    if (!token || !userRole) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }
  }

}
