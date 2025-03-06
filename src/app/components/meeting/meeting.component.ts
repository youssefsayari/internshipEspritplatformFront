import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../Model/Meeting';
import { MeetingService } from '../../Services/MeetingService';
import { User } from '../../Model/User';
import Swal from 'sweetalert2';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {
  meetings: Meeting[] = [];
  students: User[] = [];
  mostActiveStudent: User | null = null;  // Store the most active student
  editingMeeting: Meeting | null = null;
  isFormVisible = false;
  selectedStudentId: string = "";
  isCalendarVisible = false;
  tutorId = 1;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: []
  };
  p: number = 1;

  constructor(private meetingService: MeetingService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadStudents();
    this.loadMeetings();
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
            console.log("The tutor is ", userDetails.id);
          }
        },
        error: (err) => {
          console.log('Error fetching user details:', err);
        }
      });
    }
  }

  loadMeetings() {
    if (this.selectedStudentId) {
      this.meetingService.getMeetingsByStudentAndTutor(parseInt(this.selectedStudentId), this.tutorId).subscribe({
        next: (meetings) => {
          this.meetings = meetings;
          this.updateCalendarEvents();
          this.findMostActiveStudent();  // Call to update the most active student
        },
        error: (err) => console.error('Error fetching meetings:', err)
      });
    } else {
      this.meetingService.getMeetingsByTutor(this.tutorId).subscribe({
        next: (meetings) => {
          this.meetings = meetings;
          this.updateCalendarEvents();
          this.findMostActiveStudent();  // Call to update the most active student
        },
        error: (err) => console.error('Error fetching meetings:', err)
      });
    }
  }

  loadStudents() {
    this.meetingService.getStudentsByTutorId(this.tutorId).subscribe({
      next: (students) => {
        this.students = students;
        this.findMostActiveStudent();  // Call to update the most active student
      },
      error: (err) => console.error('Failed to load students', err)
    });
  }

  findMostActiveStudent() {
    if (this.students.length > 0 && this.meetings.length > 0) {
      const studentMeetingCount: { [key: number]: number } = {};

      this.meetings.forEach((meeting) => {
        if (meeting.participant) {
          const studentId = meeting.participant.idUser;
          studentMeetingCount[studentId] = (studentMeetingCount[studentId] || 0) + 1;
        }
      });

      // Find the student with the maximum number of meetings
      const mostActiveStudentId = Object.keys(studentMeetingCount).reduce((a, b) =>
        studentMeetingCount[a] > studentMeetingCount[b] ? a : b
      );

      this.mostActiveStudent = this.students.find(student => student.idUser === +mostActiveStudentId) || null;
    }
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
          this.meetingService.disapproveMeetingById(meeting.idMeeting!, result.value).subscribe(() => {
            Swal.fire('Disapproved', 'Meeting has been disapproved.', 'warning');
            this.loadMeetings();
          });
        }
      });
    } else {
      this.meetingService.approveMeetingById(meeting.idMeeting!).subscribe(() => {
        Swal.fire('Approved', 'Meeting has been approved successfully!', 'success');
        this.loadMeetings();
      });
    }
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
        this.meetingService.deleteMeetingById(idMeeting).subscribe(() => {
          Swal.fire('Deleted!', 'Your meeting has been deleted.', 'success');
          this.loadMeetings();
        });
      }
    });
  }

  trackMeeting(index: number, meeting: Meeting) {
    return meeting.idMeeting;
  }
  calculateApprovalRate() {
    if (this.meetings.length === 0) {
      Swal.fire({
        title: "📊 Meeting Stats",
        text: "No meetings available to calculate stats.",
        icon: "info"
      });
      return;
    }
  
    const approvedMeetings = this.meetings.filter(meeting => meeting.approved).length;
    const totalMeetings = this.meetings.length;
    const approvalRate = ((approvedMeetings / totalMeetings) * 100).toFixed(2);
  
    Swal.fire({
      title: "📊 Approval Rate",
      html: `<strong>Total Meetings:</strong> ${totalMeetings} <br>
             <strong>Approved Meetings:</strong> ${approvedMeetings} <br>
             <strong>Approval Rate:</strong> ${approvalRate}%`,
      icon: "success"
    });
  }
  
}
