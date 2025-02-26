import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../Model/Meeting';
import { MeetingService } from '../../Service/MeetingService';
import { User } from '../../Model/User';
import Swal from 'sweetalert2';

import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {
  meetings: Meeting[] = [];
  students: User[] = [];
  editingMeeting: Meeting | null = null;
  isFormVisible = false;
  selectedStudentId: string = "";
  isCalendarVisible = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: []
  };

  constructor(private meetingService: MeetingService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadMeetings();
  }

  loadMeetings() {
    if (this.selectedStudentId) {
      this.meetingService.getMeetingsByStudent(parseInt(this.selectedStudentId)).subscribe({
        next: (meetings) => {
          this.meetings = meetings;
          this.updateCalendarEvents();
        },
        error: (err) => console.error('Error fetching meetings:', err)
      });
    } else {
      this.meetingService.getAllMeetings().subscribe({
        next: (meetings) => {
          this.meetings = meetings;
          this.updateCalendarEvents();
        },
        error: (err) => console.error('Error fetching meetings:', err)
      });
    }
  }

  loadStudents() {
    this.meetingService.getStudentsByTutorId(1).subscribe({
      next: (students) => (this.students = students),
      error: (err) => console.error('Failed to load students', err)
    });
  }

  toggleApproval(meeting: Meeting) {
    if (meeting.approved) {
      Swal.fire({
        title: '❌ Disapprove Meeting',
        input: 'text',
        inputLabel: 'Enter reason for disapproval',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        inputValidator: (value) => (!value ? 'You need to provide a reason!' : null)
      }).then((result) => {
        if (result.isConfirmed) {
          this.meetingService.disapproveMeetingById(meeting.idMeeting!, result.value).subscribe({
            next: () => {
              Swal.fire('Disapproved', 'Meeting has been disapproved.', 'warning');
              this.loadMeetings();
            },
            error: (err) => Swal.fire('Error', 'Failed to disapprove the meeting.', 'error')
          });
        }
      });
    } else {
      this.meetingService.approveMeetingById(meeting.idMeeting!).subscribe({
        next: () => {
          Swal.fire('Approved', 'Meeting has been approved successfully!', 'success');
          this.loadMeetings();
        },
        error: (err) => Swal.fire('Error', 'Failed to approve the meeting.', 'error')
      });
    }
  }

  toggleCalendar() {
    this.isCalendarVisible = !this.isCalendarVisible;
    if (this.isCalendarVisible) {
      this.updateCalendarEvents();
    }
  }

  updateCalendarEvents() {
    this.calendarOptions.events = this.meetings
      .filter(meeting => meeting.approved)
      .map(meeting => ({
        title: `${meeting.typeMeeting} - ${meeting.participant?.firstName}`,
        start: meeting.date,
        url: meeting.link
      }));
  }

  showAddMeetingForm() {
    this.editingMeeting = null;
    this.isFormVisible = true;
  }

  showUpdateForm(meeting: Meeting) {
    this.editingMeeting = meeting;
    this.isFormVisible = true;
  }

  closeForm() {
    this.isFormVisible = false;
    this.loadMeetings();
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
        this.meetingService.deleteMeetingById(idMeeting).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Your meeting has been deleted.', 'success');
            this.loadMeetings();
          },
          error: (err) => Swal.fire('Error', 'Failed to delete the meeting.', 'error')
        });
      }
    });
  }

  trackMeeting(index: number, meeting: Meeting) {
    return meeting.idMeeting;
  }
}
