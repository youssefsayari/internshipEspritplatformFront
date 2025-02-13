import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']

})
export class ProfileCardComponent {
  @Input() image: string | undefined;  // Image de l'utilisateur
  @Input() from: string | undefined;   // Nom de l'utilisateur
  constructor() { }
}
