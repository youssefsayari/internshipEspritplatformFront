import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MeetingService } from '../../../Services/MeetingService';
import { TypeMeeting } from '../../../Model/TypeMeeting.enum';
import { User } from '../../../Model/User'; 
import Swal from 'sweetalert2';
import { UserService } from '../../../Services/user.service';

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
  @Output() meetingAdded = new EventEmitter<void>();  

  participantId: number;
  tutorId: number;

  constructor(private fb: FormBuilder, private meetingService: MeetingService, private userService: UserService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchUserDetails()
      .then(() => {
        console.log("SelectedStudent:", this.participantId);
        if (this.participantId) {
          return this.meetingService.findTutorIdByStudentId(this.participantId).toPromise();
        }
        return Promise.reject("Participant ID is undefined");
      })
      .then((tutorId: number) => {
        this.tutorId = tutorId;
        console.log("Tutor ID:", this.tutorId);
        this.loadStudents(this.tutorId);
      })
      .catch((error) => console.error('Error initializing meeting:', error));
  }

  async fetchUserDetails(): Promise<void> {
    const token = localStorage.getItem('Token');

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const userDetails = await this.userService.decodeTokenRole(token).toPromise();
      if (userDetails.role || userDetails.classe) {
        localStorage.setItem('userRole', userDetails.role);
        localStorage.setItem('userClasse', userDetails.classe);
        this.participantId = userDetails.id;
        console.log("The student is:", this.participantId);
      }
    } catch (err) {
      console.log('Error fetching user details:', err);
    }
  }

  initializeForm(): void {
    this.meetingForm = this.fb.group({
      date: ['', [Validators.required, this.notBeforeToday()]],
      heure: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')]],
      typeMeeting: [TypeMeeting.OTHER, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  loadStudents(tutorId: number): void {
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

  onSubmit(): void {
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

  closeForm(): void {
    this.close.emit();
  }
}
