import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.css']
})
export class AddMeetingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Output() close = new EventEmitter<void>();

  closeForm() {
    this.close.emit();
  }

}
