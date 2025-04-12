import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { DefenseService } from '../Services/defense.service';
import { Defense } from '../models/defense';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-tutor-calendar',
  templateUrl: './tutor-calendar.component.html',
  styleUrls: ['./tutor-calendar.component.scss']
})
export class TutorCalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  isLoading = true;

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

  tutorId = 2;

  constructor(
    private defenseService: DefenseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCalendarData();
  }

  selectedEvent: any = null; // Holds the clicked event data

  private handleEventClick(clickInfo: EventClickArg): void {
    this.selectedEvent = {
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      extendedProps: clickInfo.event.extendedProps
    };
  }
  

  private loadCalendarData(): void {
    console.log('Loading defenses for tutor:', this.tutorId);
    
    this.defenseService.getDefensesByTutorId(this.tutorId).subscribe({
      next: (defenses: Defense[]) => {
        console.log('Received defenses:', defenses);
        
        this.calendarOptions.events = defenses.map(defense => {
          const event = this.createCalendarEvent(defense);
          console.log('Created event:', event);
          return event;
        });

        // Proper calendar refresh
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.refetchEvents();
        calendarApi.render();
      },
      error: (err) => console.error('Error loading defenses:', err)
    });
  }

  private createCalendarEvent(defense: Defense): any {
    return {
      title: this.getEventTitle(defense),
      start: this.parseDateTime(defense.defenseDate, defense.defenseTime),
      allDay: false,
      backgroundColor: this.getEventColor(defense.defenseDegree),
      borderColor: 'transparent'
    };
  }

  private getEventTitle(defense: Defense): string {
    const studentName = defense.student ? 
      `${defense.student.firstName || 'Unknown'} ${defense.student.lastName || 'Student'}` : 
      'Unknown Student';
      
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
      return new Date().toISOString(); // Fallback to current date
    }
  }

  private getEventColor(grade: number): string {
    if (grade >= 16) return '#2ecc71';
    if (grade >= 10) return '#f1c40f';
    return '#e74c3c';
  }
}