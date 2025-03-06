import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';  // Import ViewEncapsulation from @angular/core


@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css'],
  encapsulation: ViewEncapsulation.None,  // Use the enum correctly

})
export class IconsComponent implements OnInit {


  image: string | undefined;
  from: string | undefined;
  showProfileCard: boolean = false;  // Nouvelle variable pour contrôler l'affichage du profile card
  // Méthode pour mettre à jour les informations du profil
  onProfileSelected(profileData: any) {
    this.image = profileData.image;
    this.from = profileData.from;
    this.showProfileCard = true;  // Affiche le profile card
    
  }



  






  constructor() {}

  ngOnInit(): void {}

 

}
