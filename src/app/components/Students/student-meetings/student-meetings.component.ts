import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../../Service/MeetingService'; 
import Swal from 'sweetalert2';  

@Component({
  selector: 'app-student-meetings',
  templateUrl: './student-meetings.component.html',
  styleUrls: ['./student-meetings.component.css']
})
export class StudentMeetingsComponent implements OnInit {
  meetings: any[] = [];  
  selectedStudentId: number = 3;  
  errorMessage: string = '';  
  isFormVisible: boolean = false;
  isCalendarVisible: boolean = false;
  p: number = 1;  

  constructor(private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.loadMeetings();  
  }

  loadMeetings(): void {
    this.meetingService.getMeetingsByStudent(this.selectedStudentId)
      .subscribe(
        (data: any[]) => {
          if (data && data.length > 0) {
            this.meetings = data;
          } else {
            this.errorMessage = 'No meetings found for this student.';
          }
        },
        error => {
          this.errorMessage = 'Failed to load meetings. Please try again later.';
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: this.errorMessage
          });
        }
      );
  }

  toggleCalendar(): void {
    this.isCalendarVisible = !this.isCalendarVisible;
  }

  showAddMeetingForm(): void {
    this.isFormVisible = true;
  }

  closeForm(): void {
    this.isFormVisible = false;
  }

  trackMeeting(index: number, meeting: any): number {
    return meeting.idMeeting;
  }
}
