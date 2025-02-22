import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MeetingService } from '../../Service/MeetingService';
import { TypeMeeting } from '../../Model/TypeMeeting.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.css']
})
export class AddMeetingComponent implements OnInit {
  meetingForm: FormGroup;
  typeMeetings = Object.keys(TypeMeeting).filter(key => isNaN(Number(key))) as Array<TypeMeeting>;

  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.meetingForm = this.fb.group({
      date: ['', [Validators.required, this.notBeforeToday()]],
      heure: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')]], 
      typeMeeting: [TypeMeeting.OTHER, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]]
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
      this.meetingService.addMeeting(this.meetingForm.value).subscribe({
        next: (result) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Meeting has been added successfully!',
          });
          this.closeForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Cannot add more meetings with types : Restitution 1 or Restitution 2!',
            //footer: error.message
          });
        }
      });
    }
  }

  closeForm() {
    this.close.emit();  
  }
}
