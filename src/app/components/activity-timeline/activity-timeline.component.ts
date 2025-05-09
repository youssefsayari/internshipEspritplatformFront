import { Component, OnInit, EventEmitter, Output,AfterViewChecked } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { PostService } from '../../Services/PostService'; // Assure-toi que le chemin est correct
import { CommentService } from '../../Services/CommentService'; // Assure-toi que le chemin est correct
import { CompanyService } from '../../Services/CompanyService'; // Assure-toi que le chemin est correct
import { RatingService } from '../../Services/RatingService'; // Assure-toi que le chemin est correct
import {InternshipService} from "../../Services/internship.service";
import { Post } from '../../Model/Post';
import { Company } from '../../Model/Company';
import { ChangeDetectorRef } from '@angular/core';
import { Comment } from '../../Model/Comment';
import { Rating } from '../../Model/Rating';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import {UserService} from '../../Services/user.service';
import { Image } from '../../Model/image';
import { ModelPredictionService } from '../../Services/model-prediction.service';
import { forkJoin, of } from 'rxjs';

interface CommentUI {
  id?: number;
  user: string;
  userId: number; // Ajouter l'ID de l'utilisateur
  text: string;
  createdAt: string; // Ajouter la date de création
}

interface Timeline {
  id?: number;
  from?: string;
  time?: string;
  image?: Image;
  title?: string;
  content?: string;
  comments?: CommentUI[];
  newComment?: string;
  selectedRating?: number;
  hoverRating?: number;
  feedbackGiven?: Boolean;
  ownerId?: number ; // Déclare une variable pour stocker l'ID de l'utilisateur
  ratings?: Rating[];  // Changer cela de number[] à Rating[]
  averageRating?: number;  // Ajouter une propriété pour la note moyenne
  sector?: string;  // Ajouter une propriété pour l'entreprise
  expiryDateTime?: string; // ISO Date string (nullable)
  isNew?: boolean; // Ajoutez cette ligne

}
interface QnAPair {
  question: string;
  answer: string;
  expanded: boolean;
}

interface AnalysisState {
  loading: boolean;
  qna: QnAPair[];
  attempts: { valid: boolean }[];
  currentValidStreak: number;
}
@Component({
  selector: 'app-activity-timeline',
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.css'],
  
})
export class ActivityTimelineComponent implements OnInit,AfterViewChecked  {
  @Output() profileSelected = new EventEmitter<{ userConnecte:number,companyIdSelected:number,companyIdConnected:number }>();
  mytimelines: Timeline[] = [];

  // Utilisateur connecté, statique à 1 pour l'instant
 // A modifier plus tard pour correspondre à l'ID de l'utilisateur connecté

  stars = [1, 2, 3, 4, 5]; // Liste des étoiles à afficher

  // Gestion de l'ouverture et fermeture du modal
  isPostCreateModalOpen = false;  // Modal pour création
  isPostEditModalOpen = false;    // Modal pour édition
  newPostContent = '';
  newPostTitle = '';
  newPostExpiryDateTime?: string; // Optionnel, peut être null
   // Retourne la date actuelle formatée pour le champ datetime-local



  selectedPostId: number | null = null; // Stocker l'ID du post sélectionné
  companyId: number =0; // Déclare une variable pour stocker l'ID de l'entreprise
  isUserInCompany: boolean = false; // Variable pour savoir si l'utilisateur appartient à une entreprise


  rating: Rating | null = null;

  selectedFile: File | null = null;


  filteredTimelines: Timeline[] = []; // Array pour stocker les timelines filtrées
  origanalTimelines: Timeline[] = []; // Array pour stocker les timelines orig
  searchText: string = ''; // Pour le texte de recherche
  selectedSector: string = ''; // Pour le secteur sélectionné

  userType: string= '';
  userConnecte: number= null;
  userConnecteOption: string= null;


  showOnlyFollowedCompanies: boolean = false;

   // Ajoutez cette propriété
   postAnalysis = new Map<number, AnalysisState>();
  postAnalysisRetries = new Map<number, number>();

//  intégrer votre modèle d'IA
predictions = new Map<number, string>();



  constructor(private postService: PostService,private internshipService: InternshipService   ,private commentService: CommentService, private userService: UserService ,private companyService: CompanyService ,private ratingService: RatingService,private cdr: ChangeDetectorRef,private toastr: ToastrService,
    private modelpredictionService: ModelPredictionService
     ) {}

  ngOnInit(): void {
    this.fetchUserDetails().then(() => {
        this.checkUserCompany();
        this.loadPosts();
        
    });

    // Ajout d'une animation pour afficher les timelines progressivement
    setTimeout(() => {
        document.querySelectorAll('.timeline-card').forEach(card => {
            card.classList.add('show');
        });
    }, 300);
}

  
fetchUserDetails(): Promise<void> {
  return new Promise((resolve, reject) => {
      const token = localStorage.getItem('Token');
      if (!token) return reject('Token non trouvé');

      this.userService.decodeTokenRole(token).subscribe({
          next: (userDetails) => {
              localStorage.setItem('userRole', userDetails.role);
              localStorage.setItem('userClasse', userDetails.classe);
              this.userType = userDetails.role;
              this.userConnecte = userDetails.id;

              const match = userDetails.classe.match(/[A-Z]+/);
              this.userConnecteOption = match ? match[0] : '';
              
              resolve();
          },
          error: (err) => {
              Swal.fire({
                  icon: 'error',
                  title: '⚠️ Error',
                  text: 'Failed to fetch user details. Please log in again.',
                  width: '50%',
                  customClass: {
                      popup: 'swal-custom-popup',
                      confirmButton: 'swal-custom-button'
                  }
              });
              reject(err);
          }
      });
  });
}


  checkUserCompany(): void {
    if (!this.userConnecte) {
        console.error('userConnecte est null, impossible de vérifier l\'entreprise');
        return;
    }
        // Si l'utilisateur est admin, on set companyId à -1 et on sort
        if (this.userType === 'Admin') {
          this.companyId = -1;
          this.isUserInCompany = false;
          return;
      }

    this.companyService.isUserInCompany(this.userConnecte).subscribe(
        (isInCompany: boolean) => {
            this.isUserInCompany = isInCompany;
            if (isInCompany) {
                this.companyService.getCompanyIdByUserId(this.userConnecte).subscribe(
                    (companyId: number) => {
                        this.companyId = companyId;
                    },
                    error => {
                        console.error('Erreur lors de la récupération de l\'ID de l\'entreprise :', error);
                    }
                );
            } else {
                console.log("L'utilisateur n'appartient à aucune entreprise.");
            }
        },
        error => {
            console.error('Erreur lors de la vérification de l\'appartenance à une entreprise :', error);
        }
    );
}

  /**
   * 🔥 Récupère les posts et les transforme en Timeline
   */


  loadPosts() {
    this.postService.getAllPosts().subscribe({
      next: (posts: Post[]) => {
        this.mytimelines = (posts || [])
          .sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())
          .map(post => this.transformPostToTimeline(post));
  
        this.origanalTimelines = [...this.mytimelines];

              // Appel des prédictions
      const predictionCalls = this.mytimelines.map(timeline => 
        this.modelpredictionService.predict(
          this.userConnecteOption,
          timeline.title,
          timeline.from
        ).pipe(
          catchError(error => of('❌ Prediction indisponible'))
        )
      );

      forkJoin(predictionCalls).subscribe(results => {
        results.forEach((result, index) => {
            if (result && result.trim().length > 0) { // Ne stocke que les réponses non vides
                const timeline = this.mytimelines[index];
                this.predictions.set(timeline.id, result);
            }
        });
    });
        
        // Schedule analysis calls with 5-second delay between each
        this.mytimelines.forEach((timeline, index) => {
          setTimeout(() => {
            this.initPostAnalysis(timeline.id, timeline.content);
          }, index * 5000); // 5-second interval between each analysis
        });
  
        this.loadRatingsForTimelines();
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.mytimelines = [];
        this.origanalTimelines = [];
      }
    });
  }

  getPredictionPercentage(postId: number): number {
    const prediction = this.predictions.get(postId);
    if (!prediction) return 0;
    
    const percentageMatch = prediction.match(/[\d.]+%/);
    return percentageMatch ? parseFloat(percentageMatch[0]) : 0;
  }
 
  // Modifier la méthode d'initialisation
  private initPostAnalysis(postId: number, content: string) {
    const state: AnalysisState = {
      loading: true,
      qna: [],
      attempts: [],
      currentValidStreak: 0
    };
  
    this.postAnalysis.set(postId, state);
  
    this.postService.analyzeInternshipOffer(content).subscribe({
      next: (result) => {
        const newState: AnalysisState = {
          loading: false,
          qna: result?.size > 0 ? 
            Array.from(result.entries()).map(([q, a]) => ({
              question: q, 
              answer: a, 
              expanded: false 
            })) : [],
          attempts: [...state.attempts, { valid: result?.size > 0 }],
          currentValidStreak: result?.size > 0 ? 1 : 0
        };
        this.postAnalysis.set(postId, newState);
      },
      error: () => {
        this.postAnalysis.set(postId, {
          ...state,
          loading: false,
          attempts: [...state.attempts, { valid: false }]
        });
      }
    });
  }

    // Ajoutez cette méthode pour basculer les réponses
    toggleAnswer(postId: number, index: number) {
      const state = this.postAnalysis.get(postId);
      if (state && state.qna[index]) {
        state.qna[index].expanded = !state.qna[index].expanded;
      }
    }

  getPostsAndFilterByCompany(companyId: number) {
    this.postService.getPostsByCompany(companyId).subscribe(
      (posts: Post[]) => {
        this.origanalTimelines = posts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map(post => this.transformPostToTimeline(post));
        
        // Réinitialiser les autres filtres
        this.searchText = '';
        this.selectedSector = '';
        this.showOnlyFollowedCompanies = false;
        
        // Appliquer les filtres
        this.mytimelines = [...this.origanalTimelines];
      },
      error => console.error('Error loading company posts:', error)
    );
  }
  private loadRatingsForTimelines() {
    this.mytimelines.forEach(timeline => {
      this.ratingService.getMyRatingForPost(timeline.id, this.userConnecte).subscribe(
        (data) => timeline.selectedRating = data ? data.stars : 0,
        (error) => console.error('Erreur lors de la récupération de la note:', error)
      );
    });
  }

  filterPosts() {
    // Toujours partir des données originales
    let filteredPosts = [...this.origanalTimelines];
  
    // Appliquer le filtre par secteur si sélectionné
    if (this.selectedSector) {
      filteredPosts = filteredPosts.filter(post => 
        post.sector && post.sector.toUpperCase() === this.selectedSector.toUpperCase()
      );
    }
  
    // Appliquer le filtre par texte si saisi
    if (this.searchText) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(this.searchText.toLowerCase()) || 
        post.content.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  
    // Appliquer le filtre par entreprises suivies si activé
    if (this.showOnlyFollowedCompanies && this.userType === 'Student') {
      this.applyFollowedCompaniesFilter(filteredPosts);
    } else {
      this.mytimelines = filteredPosts;
    }
  }
  
  private applyFollowedCompaniesFilter(postsToFilter: Timeline[]) {
    this.companyService.getCompaniesFollowedByUser(this.userConnecte).subscribe({
      next: (followedCompanies) => {
        const followedCompanyIds = followedCompanies.map(c => c.id);
        this.mytimelines = postsToFilter.filter(post => 
          followedCompanyIds.includes(post.ownerId)
        );
      },
      error: (err) => {
        console.error('Error loading followed companies:', err);
        this.mytimelines = postsToFilter;
      }
    });
  }
  onSectorChange(newSector: string) {
    this.selectedSector = newSector;
    this.showOnlyFollowedCompanies = false;
    this.filterPosts();
    this.cdr.detectChanges(); // Forcer la détection des changements
  }


ngOnChanges() {
  // Cette méthode se déclenche lorsqu'il y a un changement dans le secteur sélectionné
  this.filterPosts();
}

clearFilters() {

  window.location.reload();
}

    // Méthode pour vérifier si la date d'expiration est dans le futur
    isExpired(expiryDateTime: string): boolean {
      return new Date(expiryDateTime) > new Date();
    }

    minDateTime(): string {
      const now = new Date();
      // Récupérer les composants de la date locale
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      // Retourner au format "YYYY-MM-DDTHH:MM"
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

  /**
   * 🛠️ Convertit un Post en Timeline
   */

  private transformPostToTimeline(post: Post): Timeline {
    // Protection contre les posts null/undefined
    if (!post) {
      return this.getEmptyTimeline();
    }
  
    // Protection pour les commentaires
    const safeComments = (post.comments || []).map(c => ({
      id: c?.id ?? 0,
      user: c?.user ? `${c.user.firstName} ${c.user.lastName}` : 'Anonyme',
      userId: c?.user?.idUser ?? 0,
      text: c?.content ?? '',
      createdAt: c?.createdAt ?? new Date().toISOString()
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
    // Protection pour les ratings
    const safeRatings = post.ratings || [];
    const selectedRating = safeRatings.length > 0 ? safeRatings[0].stars : 0;
  
    return {
      id: post.id ?? 0,
      from: post.company?.name ?? 'Utilisateur inconnu',
      time: this.timeAgo(new Date(post.createdAt)),
      image: post.company?.image ?? { imageUrl: 'assets/images/profile/default-company.png' },
      title: post.title ?? 'No title',
      content: post.content ?? 'Aucun contenu disponible',
      comments: safeComments,
      newComment: '',
      selectedRating: selectedRating,
      hoverRating: 0,
      feedbackGiven: false,
      ownerId: post.company?.id ?? 0,
      ratings: safeRatings,
      averageRating: this.calculateAverageRating(safeRatings),
      sector: post.company?.sector?.toUpperCase()?.trim() ?? 'OTHER',
      expiryDateTime: post.expiryDateTime,
      isNew: true // Ajoutez cette propriété
    };
  }
  
  private getEmptyTimeline(): Timeline {
    return {
      id: 0,
      from: 'Unknown',
      time: 'Just now',
      image: { imageUrl: 'assets/images/profile/default-company.png' },
      title: 'No title',
      content: 'No content',
      comments: [],
      newComment: '',
      selectedRating: 0,
      hoverRating: 0,
      feedbackGiven: false,
      ownerId: 0,
      ratings: [],
      averageRating: 0,
      sector: 'OTHER',
      expiryDateTime: undefined
    };
  }

  timeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30.4167);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 5) {
      return "Just now";
    } else if (diffInSeconds < 60) {
      return `About ${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 60) {
      return `About ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `About ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 30) {
      return `About ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInMonths < 12) {
      return `About ${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInYears < 1) {
      return `About ${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } else {
      // Display the date in a raw format if it's over a year old
      return date.toLocaleString();
    }
}

getTimeRemaining(expiryDateTime: string): string {
  const expiryDate = new Date(expiryDateTime);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime(); // Différence en millisecondes

  if (diffMs <= 0) {
    return "Expired !";
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMinutes < 1) {
    return "Less than a minute left";
  } else if (diffMinutes < 60) {
    return `Expires in ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
  } else if (diffHours < 24) {
    return `Expires in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  } else if (diffDays < 7) {
    return `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else {
    return `Expires in ${diffWeeks} week${diffWeeks > 1 ? "s" : ""}`;
  }
}

  // Clic sur l'image ou le nom de l'utilisateur
  onProfileClick(timeline: Timeline) {
    this.profileSelected.emit({
      companyIdConnected:this.companyId,
      userConnecte : this.userConnecte,
     companyIdSelected: timeline.ownerId
     
    });
  }

  // Vérifie si le contenu est une image
  isImage(content: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(content);
  }


  addComment(timeline: Timeline): void {
    if (timeline.newComment.trim()) {
      const newComment: Comment = {
        content: timeline.newComment.trim(),
        post: {
          id: timeline.id,
        },
      };

      this.commentService.addCommentToPostAndUser(timeline.id, this.userConnecte, newComment).subscribe(
        (savedComment: Comment) => {
          timeline.comments.unshift({
            id: savedComment.id,
            user: 'Me',
            userId: this.userConnecte,
            text: savedComment.content,
            createdAt: new Date().toISOString()
          });

          timeline.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          timeline.newComment = '';
          this.toastr.success('Your comment has been successfully added!', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        },
        error => {
          console.error('Error while adding comment:', error);

          if (error.error && error.error.message) {
            if (error.error.message.includes("mots interdits")) {
              this.toastr.warning(
                "Your comment contains inappropriate language and was not posted.",
                "Warning",
                { timeOut: 4000, positionClass: 'toast-top-right' }
              );
            } else {
              this.toastr.error(error.error.message, "Error", {
                timeOut: 3000,
                positionClass: 'toast-top-right'
              });
            }
          } else {
            this.toastr.warning("Your comment contains inappropriate language and was not posted.", "Warning", {
              timeOut: 4000,
              positionClass: 'toast-top-right'
            });
          }
        }
      );
    } else {
      this.toastr.info("Your comment cannot be empty.", "Info", {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
    }
  }


  deleteComment(commentId: number): void {
    // Sélectionner l'élément HTML du commentaire
    const commentElement = document.getElementById(`comment-${commentId}`);

    if (commentElement) {
      // Ajouter une classe CSS pour l'animation de disparition
      commentElement.classList.add('fade-out');

      // Attendre la fin de l'animation avant de supprimer le commentaire
      setTimeout(() => {
        // Supprimer le commentaire du backend
        this.commentService.deleteComment(commentId).subscribe(
          () => {
            // Supprimer le commentaire du tableau local après succès de la suppression backend
            this.mytimelines.forEach(timeline => {
              timeline.comments = timeline.comments.filter(comment => comment.id !== commentId);
            });

            // Afficher un message de succès
            this.toastr.success('Le commentaire a été supprimé avec succès !', 'Succès', {
              timeOut: 3000,
              positionClass: 'toast-top-right'
            });
          },
          error => {
            console.error('Erreur lors de la suppression du commentaire :', error);
            this.toastr.error('Une erreur est survenue lors de la suppression.', 'Erreur', {
              timeOut: 3000,
              positionClass: 'toast-top-right'
            });
          }
        );
      }, 500); // Temps d'attente pour la fin de l'animation (500ms)
    }
  }

  setRating(timeline: Timeline, rating: number) {
    // Vérifier si l'utilisateur a déjà noté ce post
    this.ratingService.hasUserRated(timeline.id, this.userConnecte).subscribe(
      (hasRated: boolean) => {
        if (!hasRated) {
          // Si l'utilisateur n'a pas encore noté, on attribue la note
          timeline.selectedRating = rating;

          // Créer un nouvel objet Rating
          const newRating: Rating = {
            id: 0,  // L'ID peut être généré par le backend
            stars: rating,
            user: { idUser: this.userConnecte },
            createdAt: new Date().toISOString(),
          };

          // Assurer que la liste des notes existe, sinon la créer
          timeline.ratings = timeline.ratings || [];
          timeline.ratings.push(newRating);

          // Recalculer la moyenne des notes
          timeline.averageRating = this.calculateAverageRating(timeline.ratings);

          // Appeler le service pour ajouter la note
          this.ratingService.addRatingToPost(timeline.id, this.userConnecte, rating).subscribe(
            (response: Rating) => {
              // Mettre à jour l'état de feedback donné
              timeline.feedbackGiven = true;

              // Stocker la note dans le localStorage
              localStorage.setItem(`rated-${timeline.id}-${this.userConnecte}`, 'true');
            },
            (error) => {
              console.error('Erreur lors de l\'ajout de la note:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Erreur lors de la vérification de la note :', error);
      }
    );
  }


  addRating(postId: number, userId: number, stars: number) {
    // Créer un objet Rating
    const rating: Rating = {
      id: 0, // L'ID peut être généré par le backend
      stars: stars,
      user: { idUser: this.userConnecte },
      createdAt: new Date().toISOString(),
    };

    // Appeler le service pour ajouter la note au backend
    this.ratingService.addRatingToPost(postId, this.userConnecte, stars).subscribe(
      (response: Rating) => {
        // Enregistrer la note dans le localStorage pour une récupération future
        localStorage.setItem(`rating-${postId}-${this.userConnecte}`, stars.toString());
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la note :', error);
      }
    );
  }

  getPreviousRating(postId: number, userId: number): number {
    // Récupérer la note précédemment donnée depuis le localStorage
    return Number(localStorage.getItem(`rating-${postId}-${userId}`) || 0);
  }
  calculateAverageRating(ratings: Rating[]): number {
    if (!ratings || ratings.length === 0) {
      return 0;
    }

    const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    return totalStars / ratings.length;
  }

  // Optimisation de la boucle *ngFor avec trackBy
  trackByFn(index: number, item: Timeline): number {
    return item.id || index;
  }

// Remplacer les méthodes openPostModal et closePostModal par :

async openPostModal(isEdit: boolean = false, postId?: number) {
  // Charger les données du post si on est en mode édition
  if (isEdit && postId) {
    const postToEdit = this.mytimelines.find(post => post.id === postId);
    if (postToEdit) {
      this.newPostTitle = postToEdit.title;
      this.newPostContent = postToEdit.content;
      this.newPostExpiryDateTime = postToEdit.expiryDateTime 
        ? new Date(postToEdit.expiryDateTime).toISOString().slice(0, 16) 
        : '';
    }
  } else {
    // Réinitialiser les champs pour une nouvelle création
    this.newPostTitle = '';
    this.newPostContent = '';
    this.newPostExpiryDateTime = '';
  }

  const { value: formValues } = await Swal.fire({
    title: isEdit ? 'Edit Post' : 'New Post',
    html: `
      <input 
        id="swal-title" 
        class="swal2-input custom-title" 
        placeholder="Title" 
        value="${this.newPostTitle}"
        required
        minlength="3"
        maxlength="255"
      >
      <textarea 
        id="swal-content" 
        class="swal2-textarea custom-content" 
        placeholder="Content..." 
        required
        minlength="10"
      >${this.newPostContent}</textarea>
      <input 
        type="datetime-local" 
        id="swal-expiry" 
        class="swal2-input custom-datetime" 
        value="${this.newPostExpiryDateTime || ''}"
        min="${this.minDateTime()}"
      >
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonColor: '#FF3636',
    cancelButtonColor: '#6e7d88',
    confirmButtonText: isEdit ? 'Update' : 'Post',
    customClass: {
      popup: 'swal-custom-popup',
      validationMessage: 'swal-custom-validation'
    },
    preConfirm: () => {
      const titleInput = document.getElementById('swal-title') as HTMLInputElement;
      const contentInput = document.getElementById('swal-content') as HTMLTextAreaElement;
      
      // Validation manuelle
      if (!titleInput.value || !contentInput.value) {
        Swal.showValidationMessage('Title and content are required');
        return false;
      }
      
      if (titleInput.value.length < 3) {
        Swal.showValidationMessage('Title must be at least 3 characters');
        return false;
      }
      
      if (contentInput.value.length < 10) {
        Swal.showValidationMessage('Content must be at least 10 characters');
        return false;
      }

      return { 
        title: titleInput.value,
        content: contentInput.value,
        expiry: (document.getElementById('swal-expiry') as HTMLInputElement).value
      };
    }
  });

  if (formValues) {
    this.newPostTitle = formValues.title;
    this.newPostContent = formValues.content;
    this.newPostExpiryDateTime = formValues.expiry;

    if (isEdit && postId) {
      this.selectedPostId = postId;
      this.updatePost();
    } else {
      this.addNewPost();
    }
  }
}
// Ajouter ces méthodes de notification
private showSuccessAlert(message: string) {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    showConfirmButton: false,
    timer: 2000,
    background: '#f4f4f4',
    customClass: {
      icon: 'swal-custom-icon-success'
    }
  });
}

private showErrorAlert(message: string) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    confirmButtonColor: '#FF3636',
    background: '#f4f4f4'
  });
}



  applyAnimation() {
    setTimeout(() => {
      document.querySelectorAll('.timeline-card').forEach(card => {
        card.classList.add('show');
      });
    }, 300);
  }

  isPostDisabled(): boolean {
    return this.newPostTitle.trim() === '' || this.newPostContent.trim() === '';
  }

  deletePost(postId: number): void {
    // Sélectionner l'élément HTML du post à supprimer
    const postElement = document.getElementById(`post-${postId}`);

    if (postElement) {
      // Appliquer la classe pour démarrer l'animation de disparition
      postElement.classList.add('fade-out');
      postElement.classList.add('hidden');  // Ajout de la classe 'hidden' pour masquer avec animation

      // Retirer le post après 500ms (la durée de l'animation)
      setTimeout(() => {
        // Supprimer le post du tableau local (avant la suppression backend)
        this.mytimelines = this.mytimelines.filter(post => post.id !== postId);

        // Supprimer également le post côté backend
        this.postService.deletePost(postId).subscribe(
          () => {
            console.log("Post supprimé avec succès");
          },
          error => {
            console.error('Erreur lors de la suppression du post :', error);
          }
        );
      }, 500);  // Temps d'attente pour la fin de l'animation (500ms)
    }
  }
  editPost(postId: number): void {
    const postToEdit = this.mytimelines.find(post => post.id === postId);

    if (postToEdit) {
      this.selectedPostId = postToEdit.id;
      this.newPostTitle = postToEdit.title;
      this.newPostContent = postToEdit.content;
      this.newPostExpiryDateTime = postToEdit.expiryDateTime
        ? new Date(postToEdit.expiryDateTime).toISOString().slice(0, 16)
        : '';

      this.isPostCreateModalOpen = false;
      this.isPostEditModalOpen = true;
    }
  }

  addNewPost() {
    const newPost: Post = {
      title: this.newPostTitle,
      content: this.newPostContent,
      company: { id: this.companyId } as Company,
      expiryDateTime: this.newPostExpiryDateTime ? new Date(this.newPostExpiryDateTime).toISOString() : undefined
    };
  
    this.postService.addPostAndAffectToCompany(this.companyId, newPost).subscribe({
      next: (savedPost: Post) => {
        // Créer une nouvelle timeline avec l'animation
        const newTimeline = this.transformPostToTimeline(savedPost);
        
        // Ajouter au début du tableau
        this.mytimelines.unshift(newTimeline);
        
        // Forcer la mise à jour de la vue
        this.cdr.detectChanges();
        
        // Appliquer l'animation après un léger délai pour permettre au DOM de se mettre à jour
        setTimeout(() => {
          const newPostElement = document.getElementById(`post-${savedPost.id}`);
          if (newPostElement) {
            newPostElement.classList.add('show');
          }
        }, 50);
        
        // Afficher le message de succès
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post created successfully',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Initialiser l'analyse du post
        this.initPostAnalysis(savedPost.id, savedPost.content);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create post: ' + (error.error?.message || 'Unknown error'),
          confirmButtonColor: '#FF3636'
        });
      }
    });
  }
  updatePost() {
    if (!this.selectedPostId) return;
  
    const updatedPost: Post = {
      id: this.selectedPostId,
      title: this.newPostTitle,
      content: this.newPostContent,
      expiryDateTime: this.newPostExpiryDateTime ? new Date(this.newPostExpiryDateTime).toISOString() : undefined
    };
  
    this.postService.updatePost(updatedPost).subscribe({
      next: (savedPost: Post) => {
        // Trouver et mettre à jour le post dans le tableau
        const index = this.mytimelines.findIndex(post => post.id === this.selectedPostId);
        if (index !== -1) {
          this.mytimelines[index] = this.transformPostToTimeline(savedPost);
          this.cdr.detectChanges();
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post updated successfully',
          timer: 2000,
          showConfirmButton: false
        });
        
        this.initPostAnalysis(savedPost.id, savedPost.content);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update post: ' + (error.error?.message || 'Unknown error'),
          confirmButtonColor: '#FF3636'
        });
      }
    });
  }

  private validatePost(): boolean {
    if (!this.newPostTitle || !this.newPostContent) {
      this.showErrorAlert('Title and content are required');
      return false;
    }
    return true;
  }

  toggleFollowedCompaniesFilter() {
    this.showOnlyFollowedCompanies = !this.showOnlyFollowedCompanies;
    // Réinitialiser le filtre de secteur si on active "Followed"
    if (this.showOnlyFollowedCompanies) {
      this.selectedSector = '';
    }
    this.filterPosts();
  }
  
  ngAfterViewChecked() {
    // Retirer la classe d'animation après qu'elle ait joué
    this.mytimelines.forEach(timeline => {
      if (timeline.isNew) {
        setTimeout(() => {
          timeline.isNew = false;
          this.cdr.detectChanges();
        }, 500);
      }
    });
  }

/*---------------------5edmet ghassen-----------------------*/ 
  addInternship(postId: number): void {
    const token = localStorage.getItem('Token');
    this.userService.decodeTokenRole(token).subscribe({
      next: (userDetails) => {
        if (!userDetails.id) return;

        const internshipAddRequest = {
          idUser: userDetails.id,
          idPost: postId
        };

        this.internshipService.addInternship(internshipAddRequest).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès !',
              text: 'Votre demande de stage a été soumise avec succès.',
              confirmButtonColor: '#3085d6'
            });
          },
          error: (err) => {
            console.error("Erreur lors de la soumission du stage :", err);

            const errorMessage =
              err.error && typeof err.error === 'string'
                ? err.error
                : "Une erreur inattendue s'est produite.";

            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: errorMessage,
              confirmButtonColor: '#d33'
            });
          }
        });
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Impossible de récupérer les informations de l'utilisateur.",
          confirmButtonColor: '#d33'
        });
      }
    });
  }



  //khidmet l kthiireeyyy
  openRecommendationModal() {
    const allSkills = [
      "AI", "ANDROID", "ANGULAR", "AWS", "AZURE", "BIG DATA", "BLOCKCHAIN", "CLOUD COMPUTING",
      "CNN", "CSS", "CYBERSECURITY", "DATA ANALYSIS", "DATA VISUALIZATION", "DEEP LEARNING",
      "DEVOPS", "DJANGO", "DOCKER", "ENCRYPTION", "ETHEREUM", "FIREWALL", "FLASK", "GIT", "HTML",
      "IOT", "JAVA", "JAVASCRIPT", "KERAS", "KOTLIN", "KUBERNETES", "LINUX", "MOBILE APP",
      "MONGODB", "MYSQL", "NEURAL NETWORKS", "NODEJS", "NLP", "NUMPY", "OPENCV", "PANDAS",
      "PYTHON", "RASPBERY PI", "REACT", "RNN", "SCIKIT-LEARN", "SECURITY", "SMART CONTRACT",
      "SOLIDITY", "SPRING", "SQL", "STATISTICS", "SWIFT", "TENSORFLOW", "TEXT PROCESSING",
      "WIRELESS COMMUNICATION", "WIRELESS SYSTEMS", "CI/CD"
    ];
    
    let selectedSkills: string[] = [];
  
    Swal.fire({
      title: 'Choose your skills',
      html: `
        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
          ${allSkills.map(skill => `
            <button class="swal2-skill-btn" data-skill="${skill}">${skill}</button>
          `).join('')}
        </div>
        <div id="selected-skills" style="margin-top: 20px; font-weight: bold;"></div>
      `,
      confirmButtonText: 'Get Recommendations',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      didOpen: () => {
        const buttons = Swal.getHtmlContainer().querySelectorAll('.swal2-skill-btn');
        const selectedDiv = document.getElementById('selected-skills');
        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            const skill = btn.getAttribute('data-skill');
            if (!selectedSkills.includes(skill)) {
              selectedSkills.push(skill);
              selectedDiv!.textContent = `Selected: ${selectedSkills.join(', ')}`;
              btn.classList.add('selected');
            } else {
              selectedSkills = selectedSkills.filter(s => s !== skill);
              selectedDiv!.textContent = `Selected: ${selectedSkills.join(', ')}`;
              btn.classList.remove('selected');
            }
          });
        });
      }
    }).then(result => {
      if (result.isConfirmed && selectedSkills.length > 0) {
        this.fetchRecommendations(selectedSkills.join(', '));
      } else if (result.isConfirmed) {
        Swal.fire('Please select at least one skill.', '', 'warning');
      }
    });
  }



fetchRecommendations(skills: string) {
  this.modelpredictionService.getRecommendations(skills, 5).subscribe({
    next: (response) => {
      console.log('👉 Received response:', response);

      const titles = response?.recommendations;

      if (titles && Array.isArray(titles) && titles.length > 0) {
        // Display titles first in a styled SweetAlert
        const formattedRecommendations = titles.map(title => `
          <div style="background-color: #f0f8ff; border-radius: 8px; padding: 12px 18px; margin: 8px 0; font-size: 18px; font-weight: bold; color: #333; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            ${title}
          </div>
        `).join('');

        Swal.fire({
          icon: 'info',
          title: 'Top Recommendations',
          html: `
            <div style="padding: 20px; text-align: center;">
              <h3 style="font-size: 22px; color: #333; margin-bottom: 15px;">Recommended Fields Based on Your Skills:</h3>
              ${formattedRecommendations}
            </div>
          `,
          confirmButtonText: 'Load Matching Posts'
        }).then(result => {
          if (result.isConfirmed) {
            // After user confirms, fetch posts by title
            this.postService.getPostsByTitles(titles).subscribe({
              next: (posts: Post[]) => {
                if (posts.length > 0) {
                  this.mytimelines = posts
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(post => this.transformPostToTimeline(post));

                  this.origanalTimelines = [...this.mytimelines];

                  this.applyAnimation();
                  this.loadRatingsForTimelines();

                  Swal.fire({
                    icon: 'success',
                    title: 'Recommendations Loaded!',
                    text: 'Posts have been updated based on your skills.',
                    timer: 2000,
                    showConfirmButton: false
                  });

                  this.mytimelines.forEach((timeline, index) => {
                    setTimeout(() => {
                      this.initPostAnalysis(timeline.id, timeline.content);
                      this.modelpredictionService.predict(
                        this.userConnecteOption,
                        timeline.title,
                        timeline.from
                      ).pipe(
                        catchError(() => of('❌ Prediction indisponible'))
                      ).subscribe(result => {
                        if (result && result.trim().length > 0) {
                          this.predictions.set(timeline.id, result);
                        }
                      });
                    }, index * 5000);
                  });

                } else {
                  Swal.fire('No posts found for these recommendations.', '', 'warning');
                }
              },
              error: (err) => {
                console.error('Error fetching posts by title:', err);
                Swal.fire('Failed to load recommended posts.', '', 'error');
              }
            });
          }
        });

      } else {
        Swal.fire('No recommendations found.', '', 'warning');
      }
    },
    error: (err) => {
      console.error('Error fetching recommendations:', err);
      Swal.fire('Recommendation request failed.', '', 'error');
    }
  });
}








  
  
}


