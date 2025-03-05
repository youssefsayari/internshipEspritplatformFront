import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MeetingService } from '../../Service/MeetingService';
import { TypeMeeting } from '../../Model/TypeMeeting.enum';
import { User } from '../../Model/User'; 
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.css']
})
export class AddMeetingComponent implements OnInit {
  meetingForm: FormGroup;
  students: User[] = [];
  typeMeetings = Object.keys(TypeMeeting).filter(key => isNaN(Number(key))) as Array<TypeMeeting>;
  tutorId!: number; // Ensure tutorId is always defined

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
          if (userDetails.role || userDetails.classe) {
            localStorage.setItem('userRole', userDetails.role);
            localStorage.setItem('userClasse', userDetails.classe);
            this.tutorId = userDetails.id;
            console.log("The tutor is", this.tutorId);

            // Call loadStudents AFTER tutorId is set
            this.loadStudents(this.tutorId);
          }
        },
        error: (err) => {
          console.log('Error fetching user details:', err);
        }
      });
    }
  }

  loadStudents(tutorId: number) {
    if (!tutorId) {
      console.error("Tutor ID is undefined. Cannot fetch students.");
      return;
    }

    this.meetingService.getStudentsByTutorId(tutorId).subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => console.error('Failed to load students', error)
    });
  }

  notBeforeToday(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(control.value);
      return selectedDate <= today ? { 'notBeforeToday': true } : null;
    };
  }

  onSubmit() {
    if (this.meetingForm.valid) {
      const organiserId = this.tutorId; // Use tutorId as the organiser
      const participantId = this.meetingForm.get('studentId')?.value;

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
            text: 'Failed to add meeting With that Type!',
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
