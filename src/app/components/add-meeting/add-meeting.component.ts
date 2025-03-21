import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MeetingService } from '../../Services/MeetingService';
import { TypeMeeting } from '../../Model/TypeMeeting.enum';
import { User } from '../../Model/User'; 
import Swal from 'sweetalert2';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.css']
})
export class AddMeetingComponent implements OnInit {
  meetingForm!: FormGroup;
  students: User[] = [];
  typeMeetings = Object.keys(TypeMeeting).filter(key => isNaN(Number(key))) as Array<TypeMeeting>;
  tutorId: number | null = null; // Start as null

  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private meetingService: MeetingService, private userService: UserService) { }

  ngOnInit(): void {
    this.meetingForm = this.fb.group({
      date: ['', [Validators.required, this.notBeforeToday()]],
      heure: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')]],
      typeMeeting: [TypeMeeting.OTHER, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      studentId: [null, Validators.required]
    });

    this.fetchUserDetails();
  }

  fetchUserDetails() {
    const token = localStorage.getItem('Token');

    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          if (userDetails.id) {
            this.tutorId = userDetails.id;
            console.log("Tutor ID set to:", this.tutorId);

            // Load students AFTER tutorId is set
            this.loadStudents();
          }
        },
        error: (err) => {
          console.log('Error fetching user details:', err);
        }
      });
    }
  }

  loadStudents() {
    if (this.tutorId === null) {
      console.error("Tutor ID is undefined. Cannot fetch students.");
      return;
    }

    this.meetingService.getStudentsByTutorId(this.tutorId).subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => console.error('Failed to load students', error)
    });
  }

  notBeforeToday(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(control.value);

      return selectedDate < today ? { 'notBeforeToday': true } : null;
    };
  }

  onSubmit() {
    if (!this.tutorId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Tutor ID is not available. Please try again later.',
      });
      return;
    }

    if (this.meetingForm.valid) {
      const organiserId = this.tutorId;
      const participantId = this.meetingForm.get('studentId')?.value;

      console.log("The organiser is", organiserId);
      console.log("The participant is", participantId);

      if (!participantId) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Information',
          text: 'Please select a student for the meeting.',
        });
        return;
      }

      this.meetingService.addMeetingAndAffectToParticipant(this.meetingForm.value, organiserId, participantId).subscribe({
        next: () => {
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
            text: 'Failed to add meeting. Please check your input!',
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
