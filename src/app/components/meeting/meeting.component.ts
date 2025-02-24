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
  selectedStudentId: string = ""; // Default to ALL Meetings

  constructor(private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.loadStudents();
    this.loadMeetings(); // Load all meetings by default
  }

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

  loadStudents() {
    this.meetingService.getStudentsByTutorId(1).subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => console.error('Failed to load students', error)
    });
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
      if (result.value) {
        this.meetingService.deleteMeetingById(idMeeting).subscribe(() => {
          Swal.fire('Deleted!', 'Your meeting has been deleted.', 'success');
          this.loadMeetings();
        });
      }
    });
  }
}
