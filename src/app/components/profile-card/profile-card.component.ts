import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']

})
export class ProfileCardComponent {
  @Input() image: string | undefined;  // Image de l'utilisateur
  @Input() from: string | undefined;   // Nom de l'utilisateur
  @Output() closeCard = new EventEmitter<void>(); // Événement pour fermer la carte

  constructor() { }
  closeProfileCard() {
    this.closeCard.emit();
  }
}
