import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.scss']
})
export class InternshipComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    const userRole = localStorage.getItem('userRole');
    const userClasse = localStorage.getItem('userClasse');

    if (userRole === 'Student') {
      if (userClasse && ['1', '2', '3', '4'].includes(userClasse.charAt(0))) {
        this.router.navigate(['internship/summer-internship']);
      } else if (userClasse && userClasse.charAt(0) === '5') {
        this.router.navigate(['internship/graduation-internship']);
      }
    }
  }

}
