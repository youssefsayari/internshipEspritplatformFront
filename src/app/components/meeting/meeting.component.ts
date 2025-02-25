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

  // ✅ Load all meetings OR filter by student
  loadMeetings() {
    if (this.selectedStudentId) {
      this.meetingService.getMeetingsByStudent(parseInt(this.selectedStudentId)).subscribe(meetings => {
        this.meetings = meetings;
      });
    } else {
      this.meetingService.getAllMeetings().subscribe(meetings => {
        this.meetings = meetings;
      });
    }
  }

  // ✅ Load students for dropdown (Tutor ID = 1 for now)
  loadStudents() {
    this.meetingService.getStudentsByTutorId(1).subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => console.error('Failed to load students', error)
    });
  }

  // ✅ Toggle meeting approval/disapproval
  toggleApproval(meeting: Meeting) {
    if (meeting.approved) {
      this.meetingService.disapproveMeetingById(meeting.idMeeting!).subscribe({
        next: () => {
          Swal.fire('Disapproved', 'Meeting has been disapproved.', 'warning');

          // Prevent UI flickering
          setTimeout(() => this.loadMeetings(), 200);
        },
        error: () => Swal.fire('Error', 'Failed to disapprove the meeting.', 'error')
      });
    } else {
      this.meetingService.approveMeetingById(meeting.idMeeting!).subscribe({
        next: () => {
          Swal.fire('Approved', 'Meeting has been approved successfully!', 'success');

          // Prevent UI flickering
          setTimeout(() => this.loadMeetings(), 200);
        },
        error: () => Swal.fire('Error', 'Failed to approve the meeting.', 'error')
      });
    }
  }

  // ✅ Open add meeting form
  showAddMeetingForm() {
    this.editingMeeting = null;
    this.isFormVisible = true;
  }

  // ✅ Open update meeting form
  showUpdateForm(meeting: Meeting) {
    this.editingMeeting = meeting;
    this.isFormVisible = true;
  }

  // ✅ Close meeting form
  closeForm() {
    this.isFormVisible = false;
    this.loadMeetings();
  }

  // ✅ Delete a meeting
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
      if (result.value) {
        this.meetingService.deleteMeetingById(idMeeting).subscribe(() => {
          Swal.fire('Deleted!', 'Your meeting has been deleted.', 'success');
          this.loadMeetings();
        });
      }
    });
  }

  // ✅ Track meetings by ID to prevent UI issues
  trackMeeting(index: number, meeting: Meeting) {
    return meeting.idMeeting;
  }
}
