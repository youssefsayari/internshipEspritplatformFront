import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../../Services/MeetingService'; 
import Swal from 'sweetalert2';  
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { Meeting } from '../../../Model/Meeting';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-student-meetings',
  templateUrl: './student-meetings.component.html',
  styleUrls: ['./student-meetings.component.css']
})
export class StudentMeetingsComponent implements OnInit {
  meetings: any[] = [];  
  selectedStudentId: number ;  
  errorMessage: string = '';  
  isFormVisible: boolean = false;
  isUpdateFormVisible: boolean = false; 
  editingMeeting: Meeting | null = null;

  isCalendarVisible: boolean = false;
  p: number = 1;  
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: []
  };

  constructor(private meetingService: MeetingService,private userService : UserService) { }

  ngOnInit(): void {
    this.fetchUserDetails();
    console.log("SelectedStudent :" , this.selectedStudentId);
  }
  fetchUserDetails() {
    const token = localStorage.getItem('Token');

    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          if (userDetails.role || userDetails.classe) {
            localStorage.setItem('userRole', userDetails.role);
            localStorage.setItem('userClasse', userDetails.classe);
            this.selectedStudentId=userDetails.id;
            console.log("the student is ", userDetails.id);
            this.loadMeetings();

          }
        },
        error: (err) => {
          console.log('Error fetching user details:', err);
        }
      });
    }
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

  toggleCalendar() {
    this.isCalendarVisible = !this.isCalendarVisible;
    if (this.isCalendarVisible) {
      setTimeout(() => this.updateCalendarEvents(), 100);
    }
  }

  updateCalendarEvents() {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.meetings
        .filter(meeting => meeting.approved)
        .map(meeting => ({
          title: `${meeting.typeMeeting ?? 'Unknown'} - ${meeting.participant?.firstName ?? 'N/A'}`,
          start: meeting.date,
          extendedProps: {
            description: meeting.description ?? 'No description',
            typeMeeting: meeting.typeMeeting ?? 'Unknown',
            heure: meeting.heure ?? 'N/A',
            participant: `${meeting.participant?.firstName ?? ''} ${meeting.participant?.lastName ?? ''}`,
            link: meeting.link ?? '#'
          }
        })),
      eventClick: (info) => {
        const meeting = info.event.extendedProps;
        
        Swal.fire({
          title: '📅 Meeting Details',
          html: `
            <strong>👨‍🎓 Student:</strong> ${meeting.participant}<br>  
            <strong>📌 Type:</strong> ${info.event.title}<br>
            <strong>📅 Date:</strong> ${info.event.start?.toLocaleDateString()}<br>
            <strong>⏰ Time:</strong> ${meeting.heure}<br>
            <strong>🗒️ Description:</strong> ${meeting.description}<br>
            <strong>🔗 Meeting Link:</strong> <a href="${meeting.link}" target="_blank">Join Meeting</a>
          `,
          confirmButtonText: 'OK',
          icon: 'info'
        });
        
        info.jsEvent.preventDefault();
      }
    };
  }

  deleteMeeting(idMeeting: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.meetingService.deleteMeetingById(idMeeting).subscribe(() => {
          Swal.fire('Deleted!', 'Your meeting has been deleted.', 'success');
          this.loadMeetings();
        });
      }
    });
  }

  showAddMeetingForm(): void {
    this.isFormVisible = true;
    this.isUpdateFormVisible = false; // Hide update form when adding
  }

  showUpdateForm(meeting: Meeting) {
    this.editingMeeting = meeting;
    this.isUpdateFormVisible = true; // Ensure the update form is visible
    this.isFormVisible = false; // Hide add form
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.isUpdateFormVisible = false;
  }

  trackMeeting(index: number, meeting: any): number {
    return meeting.idMeeting;
  }
}
