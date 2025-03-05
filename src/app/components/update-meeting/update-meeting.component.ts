import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MeetingService } from '../../Services/MeetingService';
import { Meeting } from '../../Model/Meeting';
import { TypeMeeting } from '../../Model/TypeMeeting.enum';
import { User } from '../../Model/User';
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
  students: User[] = [];
  typeMeetings = Object.keys(TypeMeeting).filter(key => isNaN(Number(key))) as Array<TypeMeeting>;

  constructor(private fb: FormBuilder, private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.meetingForm = this.fb.group({
      date: [this.meeting.date, [Validators.required]],
      heure: [this.meeting.heure, [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')]],
      typeMeeting: [this.meeting.typeMeeting, Validators.required],
      description: [this.meeting.description, [Validators.required, Validators.maxLength(255)]],
      studentId: [this.meeting.participant?.idUser || null, Validators.required] 
    });

    this.loadStudents(1);  
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
      return selectedDate < today ? { 'notBeforeToday': true } : null;
    };
  }

  onSubmit() {
    if (this.meetingForm.valid) {
      const organiserId = 1; 
      const participantId = this.meetingForm.get('studentId')?.value;

      if (!participantId) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Information',
          text: 'Please select a student for the meeting.',
        });
        return;
      }

      this.meetingService.updateMeetingAndAffectToParticipant(
        { ...this.meeting, ...this.meetingForm.value }, organiserId, participantId
      ).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Meeting has been updated successfully!',
          });
          this.closeForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update the meeting!',
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
