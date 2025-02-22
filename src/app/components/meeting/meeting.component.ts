import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../Model/Meeting';
import { MeetingService } from '../../Service/MeetingService';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {
  meetings: Meeting[] = [];
  editingMeeting: Meeting | null = null;

  isFormVisible = false;

  constructor(private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings() {
    this.meetingService.getAllMeetings().subscribe(meetings => this.meetings = meetings);
  }
  showAddMeetingForm(meeting: Meeting | null) {
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
          Swal.fire(
            'Deleted!',
            'Your meeting has been deleted.',
            'success'
          );
          this.loadMeetings(); 
        });
      }
    });
  }






}
