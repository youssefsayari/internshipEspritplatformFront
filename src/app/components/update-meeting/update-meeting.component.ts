import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MeetingService } from '../../Service/MeetingService';
import { Meeting } from '../../Model/Meeting';
import { TypeMeeting } from '../../Model/TypeMeeting.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-meeting',
  templateUrl: './update-meeting.component.html',
  styleUrls: ['./update-meeting.component.css']
})
export class UpdateMeetingComponent implements OnInit {
  @Input() meeting: Meeting;
  @Output() close = new EventEmitter<void>();
  meetingForm: FormGroup;
  typeMeetings = Object.keys(TypeMeeting).filter(key => isNaN(Number(key))) as Array<TypeMeeting>;

  constructor(private fb: FormBuilder, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.meetingForm = this.fb.group({
      date: [this.meeting.date, [Validators.required, this.notBeforeToday()]],
      heure: [this.meeting.heure, [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')]],
      typeMeeting: [this.meeting.typeMeeting, Validators.required],
      description: [this.meeting.description, [Validators.required, Validators.maxLength(255)]]
    });
  }

  notBeforeToday(): Validators {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);  
      const selectedDate = new Date(control.value);
      return selectedDate < today ? { 'notBeforeToday': true } : null;
    };
  }

  onSubmit() {
    if (this.meetingForm.valid) {
      this.meetingService.updateMeeting({...this.meeting, ...this.meetingForm.value}).subscribe({
        next: () => {
          Swal.fire('Success', 'Meeting updated successfully!', 'success');
          this.close.emit();
        },
        error: (error) => Swal.fire('Error', 'Failed to update the meeting.', 'error')
      });
    }
  }

  closeForm() {
    this.close.emit();
  }
}
