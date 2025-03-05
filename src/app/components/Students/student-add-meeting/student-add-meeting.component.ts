import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MeetingService } from '../../../Service/MeetingService';
import { TypeMeeting } from '../../../Model/TypeMeeting.enum';
import { User } from '../../../Model/User'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-add-meeting',
  templateUrl: './student-add-meeting.component.html',
  styleUrls: ['./student-add-meeting.component.css']
})
export class StudentAddMeetingComponent implements OnInit {
  meetingForm: FormGroup;
  students: User[] = [];
  typeMeetings = Object.keys(TypeMeeting).filter(key => isNaN(Number(key))) as Array<TypeMeeting>;

  @Output() close = new EventEmitter<void>();

  participantId: number = 3;
  tutorId: number ;
 

  constructor(private fb: FormBuilder, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.meetingService.findTutorIdByStudentId(this.participantId).subscribe(
      (tutorId: number) => {
        this.tutorId = tutorId; 
      },
      (error) => {
        console.error('Error fetching tutorId:', error);
      }
    );
    this.meetingForm = this.fb.group({
      date: ['', [Validators.required, this.notBeforeToday()]],
      heure: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')]],
      typeMeeting: [TypeMeeting.OTHER, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]]
    });

    this.loadStudents(this.tutorId);  
  }

  loadStudents(tutorId: number) {
    this.meetingService.getStudentsByTutorId(tutorId).subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => console.error('Failed to load students', error)
    });
  }

  notBeforeToday(): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(control.value);
      return selectedDate <= today ? { 'notBeforeToday': true } : null;
    };
  }

  @Output() meetingAdded = new EventEmitter<void>();  

onSubmit() {
  if (this.meetingForm.valid) {
    const organiserId = this.tutorId; 

    this.meetingService.addMeetingAndAffectToParticipant(this.meetingForm.value, organiserId, this.participantId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Meeting has been added successfully!',
        });
        this.closeForm();
        this.meetingAdded.emit();  
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add meeting!',
          footer: error.message
        });
      }
    });
  }
}


  closeForm() {
    this.close.emit();
  }

}
