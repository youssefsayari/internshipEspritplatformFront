import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.startDate = this.today;
  }
  onDateChange() {
    this.showWarning = true;
  }

}
