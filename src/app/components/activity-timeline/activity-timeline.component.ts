import { Component, OnInit, EventEmitter, Output } from '@angular/core';

interface Comment {
  user: string;
  text: string;
}

interface Timeline {
  id: number;
  from: string;
  time: string;
  image: string;
  content: string;
  comments: Comment[];
  newComment: string;
  selectedRating: number;
  hoverRating: number;
  feedbackGiven: boolean;  // New property to track feedback submission
}


@Component({
  selector: 'app-activity-timeline',
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.css']
})
export class ActivityTimelineComponent implements OnInit {


  @Output() profileSelected = new EventEmitter<any>();  // Émet les informations du profil


  mytimelines: Timeline[] = [
    {
      id: 1,
      from: 'Andrew McDownland',
      time: '(5 minutes ago)',
      image: 'assets/images/profile/user-1.jpg',
      content: 'assets/images/stages/Offre-stage-660x371.jpg',
      comments: [],
      newComment: '',
      selectedRating: 0,
      hoverRating: 0,
      feedbackGiven: false,  // Initial state is false
    },
    {
      id: 2,
      from: 'Christopher Jamil',
      time: '(3 minutes ago)',
      image: 'assets/images/profile/user-2.jpg',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      comments: [],
      newComment: '',
      selectedRating: 0,
      hoverRating: 0,
      feedbackGiven: false,  // Initial state is false
    }
  ];


  
  stars = [1, 2, 3, 4, 5]; // Liste des étoiles à afficher

 


   // Méthode appelée lors du clic sur l'image de la timeline
   onImageClick(timeline: any) {
    this.profileSelected.emit({
      image: timeline.image,
      from: timeline.from
    });
  }

  // Méthode appelée lors du clic sur le nom de l'utilisateur
  onNameClick(timeline: any) {
    this.profileSelected.emit({
      image: timeline.image,
      from: timeline.from
    });
  }

  isImage(content: string): boolean {
    return content && (content.endsWith('.jpg') || content.endsWith('.jpeg') || content.endsWith('.png') || content.endsWith('.gif'));
  }

  addComment(timeline: Timeline): void {
    if (timeline.newComment?.trim()) {  // Vérifier si le commentaire n'est pas vide ou uniquement des espaces
      timeline.comments.push({
        user: 'Moi',  // Vous pouvez le remplacer par le nom de l'utilisateur connecté
        text: timeline.newComment.trim(),
      });
      timeline.newComment = '';  // Réinitialiser le champ de commentaire après ajout
    }
  }
  

  setRating(timeline: Timeline, rating: number): void {
    timeline.selectedRating = rating;
    timeline.hoverRating = 0; // Réinitialiser la survolée après sélection
    timeline.feedbackGiven = true;  // Set feedbackGiven to true when the rating is submitted
  }
  

  // Fonction pour le suivi des éléments avec un identifiant unique
  trackByFn(index: number, item: Timeline): number {
    return item.id;
  }

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      const timelineCards = document.querySelectorAll('.timeline-card');
      timelineCards.forEach(card => {
        card.classList.add('show'); // Ajouter la classe d'animation après le chargement de la page
      });
    }, 300); // Le délai est pour que les cartes s'affichent après le premier rendu
  }
}
