import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ai-recommendation',
  templateUrl: './ai-recommendation.component.html',
  styleUrls: ['./ai-recommendation.component.scss']
})
export class AiRecommendationComponent implements OnInit {

  problemText: string = '';
  matches: any[] = [];
  loading = false;
  errorMessage = '';
  clientId! : number;
  selectedConsultant: any = null;
  selectedSlot: any = null;
  selectedDate: any = null;
  availableSlots: any[] = [];
  constructor(private http: HttpClient, private route: ActivatedRoute) {}
  ngOnInit() {
    this.clientId = +this.route.snapshot.paramMap.get('clientId')!;
    console.log(this.clientId);

  }

  openModal(consultant: any) {
    this.selectedConsultant = consultant;
    this.selectedDate = ''; // reset
    this.availableSlots = [];
    this.selectedSlot = null;
  }

  closeModal() {
    this.selectedConsultant = null;
  }

  findMatch() {
    this.loading = true;
    this.errorMessage = '';
    this.http.post('http://localhost:8089/innoxpert/api/clients/match-consultants', {
      problemDescription: this.problemText
    }).subscribe({
      next: (data: any) => {
        this.matches = data;
        this.loading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to match consultants. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadTimeSlots() {
    if (!this.selectedDate || !this.selectedConsultant?.id) return;
    this.http.get<any[]>(`http://localhost:8089/innoxpert/api/consultants/${this.selectedConsultant.id}/timeslots?date=${this.selectedDate}`)
      .subscribe({
        next: (data) => {
          this.availableSlots = data.filter(slot => slot.available);
          console.log(this.selectedConsultant)
        },
        error: () => {
          this.errorMessage = 'Failed to load time slots.';
          console.log(this.selectedConsultant);
          console.log(this.selectedDate);
        }
      });
  }

  bookConsultation() {
    if (!this.selectedSlot) return;
    const payload = {
      clientId: this.clientId,
      consultantId: this.selectedConsultant.id,
      startTime: this.selectedSlot.startTime,
      endTime: this.selectedSlot.endTime
    };
    this.http.post('http://localhost::8089/innoxpert/api/consultations/book', payload)
      .subscribe({
        next: () => {
          alert('Consultation booked successfully!');
          this.closeModal();
        },
        error: () => {
          this.errorMessage = 'Failed to book consultation.';
        }
      });
  }
}
