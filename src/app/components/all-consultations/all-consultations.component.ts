import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Consultation } from '../../models/consullting';
import { ClientService } from '../../Services/client.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-consultations',
  templateUrl: './all-consultations.component.html',
  styleUrls: ['./all-consultations.component.scss']
})
export class AllConsultationsComponent implements OnInit {
  displayedColumns: string[] = ['index', 'client', 'consultant', 'specialty', 'status', 'meetingLink', 'startTime', 'endTime'];
  dataSource!: MatTableDataSource<Consultation>;
  calendarEvents: any[] = [];
  showCalendarView = false; // Flag to toggle calendar view
  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [], // Initialize with an empty event list
    editable: true,
    selectable: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private consultationService: ClientService) {}

  ngOnInit(): void {
    console.log('Calendar Plugins:', this.calendarPlugins);
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.consultationService.getAllConsultations().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Map consultation data to FullCalendar events
      this.calendarEvents = data.map((c, i) => ({
        title: `${c.client.fullName} with ${c.consultant.fullName}`,
        start: c.slot.startTime,
        end: c.slot.endTime,
        extendedProps: {
          index: i + 1,
          status: c.status,
          specialty: c.consultant.specialty,
          meetingLink: c.meetingLink,
          clientFullName: c.client.fullName,
          consultantFullName: c.consultant.fullName
        }
      }));

      // Update calendar options with mapped events
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.calendarEvents
      };
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleView(): void {
    this.showCalendarView = !this.showCalendarView; // Toggle calendar/table view
  }

  handleDateSelect(arg: any): void {
    alert(`Date selected: ${arg.startStr}`);
  }

  handleEventClick(arg: any) {
    const event = arg.event;
  
    const eventDetails = event.extendedProps;
    console.log(eventDetails);
  
    // Show SweetAlert2 modal with consultation details
    Swal.fire({
      title: `Consultation with ${eventDetails.clientFullName}`,
      html: `
        <p><strong>Client:</strong> ${eventDetails.clientFullName}</p>
        <p><strong>Consultant:</strong> ${eventDetails.consultantFullName}</p>
        <p><strong>Specialty:</strong> ${eventDetails.specialty}</p>
        <p><strong>Status:</strong> ${eventDetails.status}</p>
        <p><strong>Start Time:</strong> ${event.start.toLocaleString()}</p>
        <p><strong>End Time:</strong> ${event.end.toLocaleString()}</p>
        <p><strong>Meeting Link:</strong> <a href="${eventDetails.meetingLink}" target="_blank">Join Meeting</a></p>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      width: '500px',
      padding: '20px',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        htmlContainer: 'swal-html',
      }
    });
  }
}
