import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { DefenseService } from '../Services/defense.service';
import { Defense } from '../models/defense';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutor-calendar',
  templateUrl: './tutor-calendar.component.html',
  styleUrls: ['./tutor-calendar.component.scss']
})
export class TutorCalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  tutorId: number = 0;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    editable: false,
    selectable: true,
    eventDisplay: 'block',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    eventClick: this.handleEventClick.bind(this),
    eventClassNames: 'calendar-event',
    dayHeaderClassNames: 'calendar-day-header',
    eventDidMount: (info) => {
      info.el.setAttribute('title', info.event.title);
    }
  };

  constructor(
    private defenseService: DefenseService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (user) => {
          this.tutorId = user.id;
          this.loadCalendarData();
        },
        error: (err) => {
          console.error('Token decoding error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Authentication Failed',
            text: 'You must be logged in as a tutor.',
            confirmButtonColor: '#d33'
          }).then(() => this.router.navigate(['/login']));
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.calendarComponent) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.render();
      }
    }, 0);
  }

  private handleEventClick(clickInfo: EventClickArg): void {
    const defenseId = clickInfo.event.extendedProps['idDefense'];
    if (defenseId) {
      this.router.navigate(['/defense-details'], { state: { defenseId: defenseId } });
    } else {
      console.error('No defense ID found in event:', clickInfo.event);
    }
  }
  

  private loadCalendarData(): void {
    this.defenseService.getDefensesByTutorId(this.tutorId).subscribe({
      next: (defenses: Defense[]) => {
        this.calendarOptions.events = defenses.map(defense =>
          this.createCalendarEvent(defense)
        );
      },
      error: (err) => {
        console.error('Error loading defenses:', err);
        Swal.fire({
          icon: 'error',
          title: 'Loading Failed',
          text: 'Could not load your defenses.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  private createCalendarEvent(defense: Defense): any {
    return {
      title: this.getEventTitle(defense),
      start: this.parseDateTime(defense.defenseDate, defense.defenseTime),
      allDay: false,
      backgroundColor: this.getEventColor(defense.defenseDegree),
      borderColor: 'transparent',
      extendedProps: {
        idDefense: defense.idDefense
      }
    };
  }

  private getEventTitle(defense: Defense): string {
    const studentName = defense.student
      ? `${defense.student.firstName || 'Unknown'} ${defense.student.lastName || 'Student'}`
      : 'Unknown Student';
    return `📘 ${studentName} - ${defense.classroom || 'No Classroom'}`;
  }

  private parseDateTime(date: string, time: string): string {
    try {
      const dateObj = new Date(date);
      const isoDate = dateObj.toISOString().split('T')[0];
      const formattedTime = time.includes(':') ? time : `${time}:00`;
      return `${isoDate}T${formattedTime}`;
    } catch (error) {
      console.error('Error parsing date/time:', error);
      return new Date().toISOString();
    }
  }

  private getEventColor(grade: number): string {
    if (grade === 0) return '#bdc3c7'; // gray
    if (grade >= 16) return '#2ecc71'; // green
    if (grade >= 10) return '#f1c40f'; // yellow
    return '#e74c3c'; // red
  }

  goToToday(): void {
    this.calendarComponent.getApi().today();
  }

  goToPrev(): void {
    this.calendarComponent.getApi().prev();
  }

  goToNext(): void {
    this.calendarComponent.getApi().next();
  }
}
