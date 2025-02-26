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
  feedbackGiven: boolean; // Indique si un feedback a été donné
}

@Component({
  selector: 'app-activity-timeline',
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.css']
})
export class ActivityTimelineComponent implements OnInit {

  @Output() profileSelected = new EventEmitter<{ image: string; from: string }>();

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
      feedbackGiven: false
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
      feedbackGiven: false
    }
  ];

  stars = [1, 2, 3, 4, 5]; // Liste des étoiles à afficher

  // Clic sur l'image de l'utilisateur
  onImageClick(timeline: Timeline) {
    this.profileSelected.emit({
      image: timeline.image,
      from: timeline.from
    });
  }

  // Clic sur le nom de l'utilisateur
  onNameClick(timeline: Timeline) {
    this.profileSelected.emit({
      image: timeline.image,
      from: timeline.from
    });
  }

  // Vérifie si le contenu est une image
  isImage(content: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(content);
  }

  // Ajout d'un commentaire
  addComment(timeline: Timeline): void {
    if (timeline.newComment.trim()) {
      timeline.comments.push({
        user: 'Moi', // Remplacer par l'utilisateur connecté si nécessaire
        text: timeline.newComment.trim()
      });
      timeline.newComment = ''; // Réinitialisation
    }
  }

  // Gestion du rating par étoiles
  setRating(timeline: Timeline, rating: number): void {
    timeline.selectedRating = rating;
    timeline.hoverRating = 0;
    timeline.feedbackGiven = true; // Marque que le feedback a été donné
  }

  // Optimisation de la boucle *ngFor avec trackBy
  trackByFn(index: number, item: Timeline): number {
    return item.id;
  }

  constructor() {}

  ngOnInit(): void {
    // Ajout d'une animation pour afficher les timelines progressivement
    setTimeout(() => {
      document.querySelectorAll('.timeline-card').forEach(card => {
        card.classList.add('show');
      });
    }, 300);
  }

  // Gestion de l'ouverture et fermeture du modal
  isPostModalOpen = false;
  newPostContent = '';

  openPostModal() {
    this.isPostModalOpen = true;
  }

  closePostModal() {
    this.isPostModalOpen = false;
  }

  // Ajout d'un nouveau post
  addNewPost() {
    if (this.newPostContent.trim() === '') return; // Empêche les posts vides

    const newPost: Timeline = {
      id: Date.now(), // Génération d'un ID unique
      from: 'Moi',
      time: new Date().toLocaleString(),
      image: '',
      content: this.newPostContent,
      selectedRating: 0,
      hoverRating: 0,
      feedbackGiven: false,
      comments: [],
      newComment: ''
    };

    this.mytimelines.unshift(newPost); // Ajoute en haut de la liste
    this.newPostContent = ''; // Réinitialisation
    this.closePostModal(); // Fermeture du modal
  }

}
