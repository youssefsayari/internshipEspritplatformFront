import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';  // Import SweetAlert2

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
  clientId!: number;

  selectedConsultant: any = null;
  selectedSlot: any = null;
  selectedDate: string = '';
  availableSlots: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.clientId = +this.route.snapshot.paramMap.get('clientId')!;
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
      error: () => {
        this.errorMessage = 'Failed to match consultants. Please try again later.';
        this.loading = false;
      }
    });
  }

  openModal(consultant: any) {
    this.selectedConsultant = consultant;
    this.selectedDate = '';
    this.selectedSlot = null;
    this.availableSlots = [];
  }

  closeModal() {
    this.selectedConsultant = null;
    this.selectedDate = '';
    this.selectedSlot = null;
    this.availableSlots = [];
  }

  loadTimeSlots() {
    if (!this.selectedDate || !this.selectedConsultant?.id) return;

    const url = `http://localhost:8089/innoxpert/api/consultants/${this.selectedConsultant.id}/timeslots?date=${this.selectedDate}`;
    this.http.get<any[]>(url).subscribe({
      next: data => {
        this.availableSlots = data.filter(slot => slot.available);
        this.selectedSlot = null;
      },
      error: () => {
        this.errorMessage = 'Failed to load time slots.';
      }
    });
  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;
  }

  bookConsultation() {
    if (!this.selectedSlot) return;
  
    const formattedStartTime = this.formatDateTime(this.selectedDate);
    const formattedEndTime = this.formatDateTime(this.selectedSlot.endTime);
  
    const payload = {
      clientId: this.clientId,
      consultantId: this.selectedConsultant.id,
      startTime: formattedStartTime,
      endTime: formattedEndTime
    };
  
    this.http.post('http://localhost:8089/innoxpert/api/clients/consultations/book', payload).subscribe({
      next: () => {
        // Show success SweetAlert
        Swal.fire({
          title: 'Consultation Booked!',
          text: 'Your consultation has been successfully booked.',
          icon: 'success', // Success icon
          confirmButtonText: 'OK'
        });
        this.closeModal();
      },
      error: () => {
        this.errorMessage = 'Failed to book consultation.';
      }
    });
  }
}
