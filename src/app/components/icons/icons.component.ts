import { Component, HostListener, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';  // Import ViewEncapsulation from @angular/core
import {trigger,state,style,animate,transition,} from '@angular/animations';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css'],
  encapsulation: ViewEncapsulation.None,  // Use the enum correctly

  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),
      transition(':enter, :leave', [
        animate('0.4s ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class IconsComponent implements OnInit {
  @HostBinding('@fadeInOut') get fadeInOut() {
    return true;
  }


  image: string | undefined;
  from: string | undefined;
  showProfileCard: boolean = false;  // Nouvelle variable pour contrôler l'affichage du profile card

  constructor() {}

  ngOnInit(): void {}

  // Méthode pour mettre à jour les informations du profil
  onProfileSelected(profileData: any) {
    this.image = profileData.image;
    this.from = profileData.from;
    this.showProfileCard = true;  // Affiche le profile card
    
  }
  onCloseCard() {
    this.showProfileCard = false;
  }



  







 

}
