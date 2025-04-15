import { Component, OnInit } from '@angular/core';
import { Reclamation, ReclamationStatus } from '../../models/reclamation';
import { ReclamationService } from '../../Services/reclamation.service';
import { CurrentUserService } from '../../Services/current-user.service';
import { UserRec } from '../../models/user-rec';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  reclamations: Reclamation[] = [];
  newReclamation: Reclamation = {
    subject: '',
    description: '',
    status: ReclamationStatus.PENDING,
    userId: 0
  };
  currentUser!: UserRec;
  isEditing: boolean = false;
  editId: number | null = null;
  responseText: { [id: number]: string } = {};
  ReclamationStatus = ReclamationStatus;
  selectedFilter: 'NEW' | 'IN_PROGRESS' | null = null;
  showArchive: boolean = false;

  forbiddenWords: string[] = [
    'merde', 'putain', 'fuck', 'shit', 'bastard', 'con', 'salope', 'fucker', 'pute', 'idiot'
  ];

  constructor(
    private reclamationService: ReclamationService,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.currentUserService.fetchUserDetails().then(() => {
      this.currentUser = this.currentUserService.getCurrentUser();
      this.getReclamations();
    }).catch((err) => {
      console.error('Erreur de récupération des détails de l’utilisateur : ', err);
      Swal.fire({
        icon: 'error',
        title: '⚠️ Erreur',
        text: 'Echec de la récupération des détails de l’utilisateur. Veuillez vous reconnecter.',
        width: '50%',
        customClass: {
          popup: 'swal-custom-popup',
          confirmButton: 'swal-custom-button'
        }
      });
    });
  }

  getReclamations(): void {
    this.reclamationService.getAll().subscribe({
      next: (data) => (this.reclamations = data),
      error: (err) => console.error('Erreur de chargement : ', err)
    });
  }

  deleteReclamation(id: number): void {
    Swal.fire({
      title: 'Supprimer ?',
      text: 'Voulez-vous vraiment supprimer cette réclamation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reclamationService.delete(id).subscribe({
          next: () => {
            this.getReclamations();
            Swal.fire('Supprimée !', 'La réclamation a été supprimée.', 'success');
          },
          error: (err) => console.error('Erreur de suppression : ', err)
        });
      }
    });
  }

  // ✅ MÉTHODE MANQUANTE AJOUTÉE ICI
  rejectByAdmin(reclamation: Reclamation): void {
    Swal.fire({
      title: 'Rejeter cette réclamation ?',
      text: 'Cette action rejettera définitivement cette réclamation.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '✅ Accepter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#e74c3c'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reclamationService.reject(reclamation.id!).subscribe({
          next: () => {
            this.getReclamations();
            Swal.fire({
              icon: 'success',
              title: 'Réclamation rejetée !',
              text: 'La réclamation a été rejetée avec succès.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => console.error('Erreur lors du rejet : ', err)
        });
      }
    });
  }

  get filteredReclamations(): Reclamation[] {
    if (!this.isAdminUser() || !this.selectedFilter) return [];
    if (this.selectedFilter === 'NEW') {
      return this.reclamations.filter(r => r.status === ReclamationStatus.PENDING);
    } else if (this.selectedFilter === 'IN_PROGRESS') {
      return this.reclamations.filter(r => r.status === ReclamationStatus.IN_PROGRESS && r.adminId === this.currentUser.idUser);
    }
    return [];
  }

  get archivedReclamations(): Reclamation[] {
    if (this.isAdminUser()) {
      return this.reclamations.filter(r => r.status === ReclamationStatus.RESOLVED);
    }
    return this.reclamations.filter(r =>
      r.status === ReclamationStatus.RESOLVED && r.userId === this.currentUser.idUser
    );
  }

  get studentRelevantReclamations(): Reclamation[] {
    return this.reclamations.filter(r =>
      r.userId === this.currentUser.idUser &&
      [ReclamationStatus.PENDING, ReclamationStatus.IN_PROGRESS, ReclamationStatus.REJECTED].includes(r.status)
    );
  }

  onFilterChange(filter: 'NEW' | 'IN_PROGRESS'): void {
    this.selectedFilter = filter;
    this.showArchive = false;
  }

  toggleArchive(): void {
    this.showArchive = !this.showArchive;
    if (this.showArchive) {
      this.selectedFilter = null;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  containsForbiddenWords(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.forbiddenWords.some(word => new RegExp('\\b' + word + '\\b', 'i').test(lowerText));
  }

  createOrUpdateReclamation(): void {
    if (!this.isValid()) {
      Swal.fire({
        icon: 'error',
        title: 'Champs invalides',
        text: '❌ Veuillez remplir correctement les champs !'
      });
      return;
    }

  

    const combinedText = `${this.newReclamation.subject} ${this.newReclamation.description}`;
    if (this.containsForbiddenWords(combinedText)) {
      Swal.fire({
        icon: 'error',
        title: '⚠️ Contenu inacceptable',
        text: 'Vous avez utilisé un langage inapproprié. Votre accès peut être suspendu !'
      });
      return;
    }

    if (this.isEditing && this.editId !== null) {
      this.reclamationService.update(this.editId, this.newReclamation).subscribe({
        next: () => {
          this.cancelEdit();
          this.getReclamations();
          Swal.fire('✅ Mise à jour', 'Réclamation mise à jour avec succès.', 'success');
        },
        error: (err) => console.error('Erreur de mise à jour : ', err)
      });
    } else {
      this.reclamationService.create(this.currentUser.idUser, this.newReclamation).subscribe({
        next: () => {
          this.newReclamation = {
            subject: '',
            description: '',
            status: ReclamationStatus.PENDING,
            userId: this.currentUser.idUser
          };
          this.getReclamations();
          Swal.fire('✅ Créée', 'Réclamation ajoutée avec succès.', 'success');
        },
        error: (err) => console.error('Erreur de création : ', err)
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editId = null;
    this.newReclamation = {
      subject: '',
      description: '',
      status: ReclamationStatus.PENDING,
      userId: this.currentUser.idUser
    };
  }

  isSubjectInvalid(): boolean {
    const s = this.newReclamation.subject?.trim() || '';
    return !s || /^\d+$/.test(s);
  }

  isDescriptionInvalid(): boolean {
    const d = this.newReclamation.description?.trim() || '';
    return d.length < 10;
  }

  isValid(): boolean {
    return !this.isSubjectInvalid() && !this.isDescriptionInvalid();
  }

  isAdminUser(): boolean {
    return this.currentUser?.typeUser === 'ADMIN';
  }

  isUser(): boolean {
    return this.currentUser?.typeUser === 'USER';
  }

  progressReclamation(r: Reclamation): void {
    this.reclamationService.progress(r.id, this.currentUser.idUser).subscribe({
      next: () => {
        this.getReclamations();
        this.responseText[r.id!] = '';
        Swal.fire('✅ Répondu', 'Réclamation marquée comme progress.', 'success');
      },
      error: (err) => console.error('Erreur en répondant : ', err)
    });
  }

  respondToReclamation(r: Reclamation): void {
    const response = this.responseText[r.id!];
    if (!response) {
      Swal.fire({
        icon: 'warning',
        title: 'Réponse requise',
        text: 'Veuillez écrire une réponse avant de résoudre !'
      });
      return;
    }

    this.reclamationService.respond(r.id!, response).subscribe({
      next: () => {
        this.getReclamations();
        this.responseText[r.id!] = '';
        Swal.fire('✅ Répondu', 'Réclamation marquée comme résolue.', 'success');
      },
      error: (err) => console.error('Erreur en répondant : ', err)
    });
  }

  editReclamation(r: Reclamation): void {
    this.isEditing = true;
    this.editId = r.id!;
    this.newReclamation = { ...r };
  }

}
