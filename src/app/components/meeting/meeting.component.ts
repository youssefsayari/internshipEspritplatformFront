import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../Model/Meeting';
import { MeetingService } from '../../Service/MeetingService';
import { User } from '../../Model/User';
import Swal from 'sweetalert2';

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
  selectedStudentId: string = ""; // Default: Show all meetings

  constructor(private meetingService: MeetingService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadMeetings();
  }

  /** ✅ Load all meetings OR filter by student */
  loadMeetings() {
    if (this.selectedStudentId) {
      this.meetingService.getMeetingsByStudent(parseInt(this.selectedStudentId)).subscribe({
        next: (meetings) => (this.meetings = meetings),
        error: (err) => console.error('Error fetching meetings:', err)
      });
    } else {
      this.meetingService.getAllMeetings().subscribe({
        next: (meetings) => (this.meetings = meetings),
        error: (err) => console.error('Error fetching meetings:', err)
      });
    }
  }

  /** ✅ Load students for dropdown (Tutor ID = 1 for now) */
  loadStudents() {
    this.meetingService.getStudentsByTutorId(1).subscribe({
      next: (students) => (this.students = students),
      error: (err) => console.error('Failed to load students', err)
    });
  }

  /** ✅ Approve or Disapprove Meeting */
  toggleApproval(meeting: Meeting) {
    if (meeting.approved) {
      // 🔴 Disapprove: Ask for reason
      Swal.fire({
        title: '❌ Disapprove Meeting',
        input: 'text',
        inputLabel: 'Enter reason for disapproval',
        inputPlaceholder: 'Type your reason here...',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => (!value ? 'You need to provide a reason!' : null)
      }).then((result) => {
        if (result.isConfirmed) {
          this.meetingService.disapproveMeetingById(meeting.idMeeting!, result.value).subscribe({
            next: () => {
              Swal.fire('Disapproved', 'Meeting has been disapproved.', 'warning');
              setTimeout(() => this.loadMeetings(), 200);
            },
            error: (err) => {
              console.error('Error disapproving meeting:', err);
              Swal.fire('Error', 'Failed to disapprove the meeting.', 'error');
            }
          });
        }
      });
    } else {
      // ✅ Approve Meeting
      this.meetingService.approveMeetingById(meeting.idMeeting!).subscribe({
        next: () => {
          Swal.fire('Approved', 'Meeting has been approved successfully!', 'success');
          setTimeout(() => this.loadMeetings(), 200);
        },
        error: (err) => {
          console.error('Error approving meeting:', err);
          Swal.fire('Error', 'Failed to approve the meeting.', 'error');
        }
      });
    }
  }

  /** ✅ Show Add Meeting Form */
  showAddMeetingForm() {
    this.editingMeeting = null;
    this.isFormVisible = true;
  }

  /** ✅ Show Update Meeting Form */
  showUpdateForm(meeting: Meeting) {
    this.editingMeeting = meeting;
    this.isFormVisible = true;
  }

  /** ✅ Close Form */
  closeForm() {
    this.isFormVisible = false;
    this.loadMeetings();
  }

  /** ✅ Delete Meeting */
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
          error: (err) => {
            console.error('Error deleting meeting:', err);
            Swal.fire('Error', 'Failed to delete the meeting.', 'error');
          }
        });
      }
    });
  }

  /** ✅ Track Meetings for Optimization */
  trackMeeting(index: number, meeting: Meeting) {
    return meeting.idMeeting;
  }
}
