import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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

interface CommentUI {
  id?: number;
  user: string;
  userId: number; // Ajouter l'ID de l'utilisateur
  text: string;
  createdAt: string; // Ajouter la date de création
}

interface Timeline {
  id: number;
  from: string;
  time: string;
  image: Image;
  title: string;
  content: string;
  comments: CommentUI[];
  newComment: string;
  selectedRating: number;
  hoverRating: number;
  feedbackGiven: Boolean;
  ownerId: number ; // Déclare une variable pour stocker l'ID de l'utilisateur
  ratings?: Rating[];  // Changer cela de number[] à Rating[]
  averageRating?: number;  // Ajouter une propriété pour la note moyenne
  sector?: string;  // Ajouter une propriété pour l'entreprise
  expiryDateTime?: string; // ISO Date string (nullable)
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
export class ActivityTimelineComponent implements OnInit {
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

  showOnlyFollowedCompanies: boolean = false;

   // Ajoutez cette propriété
   postAnalysis = new Map<number, AnalysisState>();
  postAnalysisRetries = new Map<number, number>();




  constructor(private postService: PostService,private internshipService: InternshipService   ,private commentService: CommentService, private userService: UserService ,private companyService: CompanyService ,private ratingService: RatingService,private cdr: ChangeDetectorRef,private toastr: ToastrService   ) {}

  ngOnInit(): void {
    this.fetchUserDetails().then(() => {
        this.checkUserCompany();
        console.error('isUserInCompany', this.isUserInCompany);

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
          console.log("Utilisateur admin détecté, companyId set à -1");
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
    this.postService.getAllPosts().subscribe(
      (posts: Post[]) => {
        console.log("Posts récupérés :", posts);

        // Trier les posts du plus récent au plus ancien
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        this.mytimelines = posts.map(post => {
          const timeline = this.transformPostToTimeline(post);

          // Calculer la note moyenne pour chaque post
          timeline.averageRating = this.calculateAverageRating(timeline.ratings);
          this.initPostAnalysis(timeline.id, timeline.content); // Démarrage immédiat

          return timeline;
        });

        this.origanalTimelines = [...this.mytimelines]; // Sauvegarder les posts originaux
  
        // Maintenant que les timelines sont chargées, récupérez la note
        this.mytimelines.forEach(timeline => {
          this.ratingService.getMyRatingForPost(timeline.id, this.userConnecte).subscribe(
            (data) => {
              timeline.selectedRating = data ? data.stars : 0;  // Met à jour la note si elle existe
            },
            (error) => {
              console.error('Erreur lors de la récupération de la note:', error);
            }
          );
        });
      },
      error => {
        console.error('Erreur lors de la récupération des posts :', error);
      }
    );
  }
 
  // Modifier la méthode d'initialisation
private initPostAnalysis(postId: number, content: string, retryCount: number = 0) {
  const maxRetries = 10;
  const state = this.postAnalysis.get(postId) || {
    loading: false,
    qna: [],
    attempts: [],
    currentValidStreak: 0
  };

  if (retryCount >= maxRetries) {
    // Aucun affichage si pas 2 succès consécutifs
    const finalState: AnalysisState = {
      ...state,
      loading: false,
      qna: state.currentValidStreak >= 2 ? state.qna : []
    };
    this.postAnalysis.set(postId, finalState);
    return;
  }

  this.postAnalysis.set(postId, { ...state, loading: true });

  this.postService.analyzeInternshipOffer(content).subscribe({
    next: (result) => {
      const isValid = result?.size > 0;
      const newStreak = isValid ? state.currentValidStreak + 1 : 0;
      
      const newState: AnalysisState = {
        loading: false,
        qna: newStreak >= 2 ? 
          Array.from(result.entries()).map(([q, a]) => ({ 
            question: q, 
            answer: a, 
            expanded: false 
          })) : 
          state.qna,
        attempts: [...state.attempts, { valid: isValid }],
        currentValidStreak: newStreak
      };

      this.postAnalysis.set(postId, newState);

      // Continuer uniquement si besoin de plus de tentatives
      if (newStreak < 2 && retryCount + 1 < maxRetries) {
        setTimeout(() => 
          this.initPostAnalysis(postId, content, retryCount + 1), 
          1000 // 2s entre les tentatives
        );
      }
    },
    error: () => {
      this.postAnalysis.set(postId, {
        ...state,
        loading: false,
        attempts: [...state.attempts, { valid: false }],
        currentValidStreak: 0
      });
      
      if (retryCount + 1 < maxRetries) {
        setTimeout(() => 
          this.initPostAnalysis(postId, content, retryCount + 1), 
          1000
        );
      }
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
    const selectedRating = post.ratings && post.ratings.length > 0 ? post.ratings[0].stars : 0;

    return {
      id: post.id,
      from: post.company?.name ?? 'Utilisateur inconnu',
      time: this.timeAgo(new Date(post.createdAt)),
      image: post.company.image,
      title: post.title,
      content: post.content ?? 'Aucun contenu disponible',
      comments: post.comments
        .map(c => ({
          id: c.id ?? 0,
          user: c.user ? `${c.user.firstName} ${c.user.lastName}` : 'Anonyme',
          userId: c.user.idUser ?? 0,
          text: c.content ?? '',
          createdAt: c.createdAt
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      newComment: '',
      selectedRating: selectedRating,  // Initialiser avec la note
      hoverRating: 0,
      feedbackGiven: false,
      ownerId: post.company.id,
      ratings: post.ratings,  // Directly assign the entire Rating[] array
      sector: post.company?.sector?.toUpperCase().trim(), // Normalisation
      expiryDateTime: post.expiryDateTime, // ISO Date string (nullable)


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

  // Gestion de l'ouverture du modal pour un nouveau post
  openPostModal(isEdit: boolean = false, postId?: number) {
    if (isEdit && postId) {
      this.editPost(postId); // Remplir les données pour l'édition
      this.isPostEditModalOpen = true;
    } else {
      // Réinitialiser les champs lorsqu'on ouvre la modal pour un nouveau post
      this.newPostTitle = '';  // Réinitialiser le titre
      this.newPostContent = '';  // Réinitialiser le contenu
      this.selectedPostId = null;  // Réinitialiser l'ID du post sélectionné

      this.isPostCreateModalOpen = true;
    }
  }

  closePostModal() {
    this.isPostCreateModalOpen = false;
    this.isPostEditModalOpen = false;
  }

  addNewPost() {
    if (this.newPostContent.trim() === '' || this.newPostTitle.trim() === ''|| !this.companyId) {
      return;
    }


    const newPost: Post = {
     // id: Date.now(),
      title: this.newPostTitle,
      content: this.newPostContent,
     // createdAt: new Date().toISOString(),
      company: { id: this.companyId } as Company,
      comments: [],
      ratings: [],
      expiryDateTime: this.newPostExpiryDateTime ? new Date(this.newPostExpiryDateTime).toISOString() : undefined

    };

    this.postService.addPostAndAffectToCompany(this.companyId, newPost).subscribe(
      (savedPost: Post) => {
        this.mytimelines.unshift(this.transformPostToTimeline(savedPost));
        setTimeout(() => {
          this.cdr.detectChanges();
          this.applyAnimation();
        }, 0);
        this.newPostTitle = '';
        this.newPostContent = '';
        this.newPostExpiryDateTime = '';

        this.closePostModal();
        this.initPostAnalysis(savedPost.id, savedPost.content);
      },
      error => {
        console.error('Erreur lors de l\'ajout du post :', error);
      }
    );
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

  updatePost(): void {
    if (this.newPostTitle.trim() === '' || this.newPostContent.trim() === '' || !this.selectedPostId) {
      return;
    }

    const updatedPost: Post = {
      id: this.selectedPostId,
      title: this.newPostTitle,
      content: this.newPostContent,
      expiryDateTime: this.newPostExpiryDateTime ? new Date(this.newPostExpiryDateTime).toISOString() : undefined
    };

    this.postService.updatePost(updatedPost).subscribe(
      (savedPost: Post) => {
        // Recherche du post mis à jour et remplacement
        const index = this.mytimelines.findIndex(post => post.id === updatedPost.id);
        if (index !== -1) {
          this.mytimelines[index] = this.transformPostToTimeline(savedPost);
        }

        // Réinitialise l'état des modaux et des champs
        this.selectedPostId = null;
        this.newPostTitle = '';
        this.newPostContent = '';
        this.newPostExpiryDateTime = '';
        this.closePostModal();
        this.initPostAnalysis(savedPost.id, savedPost.content);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du post :', error);
      }
    );
  }
  toggleFollowedCompaniesFilter() {
    this.showOnlyFollowedCompanies = !this.showOnlyFollowedCompanies;
    // Réinitialiser le filtre de secteur si on active "Followed"
    if (this.showOnlyFollowedCompanies) {
      this.selectedSector = '';
    }
    this.filterPosts();
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

}
