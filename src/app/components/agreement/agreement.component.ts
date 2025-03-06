import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {
  today: string;
  startDate: string;
  endDate: string = '';
  showWarning: boolean = false;
  constructor(private router: Router) { }


  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.startDate = this.today;
    const userRole = localStorage.getItem('userRole');
    const userClasse = localStorage.getItem('userClasse');
    const token = localStorage.getItem('Token');

    if (!token || !userRole) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }

  }
  onDateChange() {
    this.showWarning = true;
  }

}
