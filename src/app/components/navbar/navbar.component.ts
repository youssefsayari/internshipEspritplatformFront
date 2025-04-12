import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../Services/NotificationService'; // Import du service
import { Notification } from '../../models/notification'; // Import du modèle Notification
import { UserService } from '../../Services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private listTitles: any[] = [];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  public isCollapsed = true;
  notifications: Notification[] = []; // Liste des notifications
  unreadNotifications: number = 0; // Compteur des notifications non lues
  notificationsVisible: boolean = false; // Flag pour gérer la visibilité du menu de notifications
  userType: string = '';
  userConnecte: number = 0;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.fetchUserDetails()
      .then(() => {
        console.log('Utilisateur connecté:', this.userConnecte);
        
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        
        this.router.events.subscribe((event) => {
          this.sidebarClose();
          const $layer: any = document.getElementsByClassName('close-layer')[0];
          if ($layer) {
            $layer.remove();
            this.mobile_menu_visible = 0;
          }
        });
        
        this.loadNotifications();
      })
      .catch(error => {
        console.error('Erreur lors du chargement des détails utilisateur:', error);
      });
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
            title: '⚠️ Erreur',
            text: 'Échec de la récupération des détails utilisateur. Veuillez vous reconnecter.',
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
  

  loadNotifications() {
    const userId = this.userConnecte || 2;
    this.notificationService.getNotificationsForUser(userId).subscribe(
      (notifications) => {
        this.notifications = notifications;
        this.unreadNotifications = notifications.filter(n => !n.vue).length;

        // Si des notifications non lues, jouer le son
        if (this.unreadNotifications > 0) {
          this.playNotificationSound();
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications', error);
      }
    );
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe(
      () => {
        this.notifications = this.notifications.map((notification) => {
          if (notification.id === notificationId) {
            notification.vue = true;
          }
          return notification;
        });
        this.unreadNotifications = this.notifications.filter(n => !n.vue).length;
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la notification', error);
      }
    );
  }

  toggleNotifications() {
    this.notificationsVisible = !this.notificationsVisible; // Basculer la visibilité du menu des notifications
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    const html = document.getElementsByTagName('html')[0];
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    this.toggleButton.classList.remove('toggled');
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = '';
      }, 500);
    }
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  }
  // Dans votre composant TypeScript
  formatTimeAgo(dateInput: any): string {
    // Debug
    console.log('Date brute reçue:', dateInput);
  
    let dateString: string;
    
    // Si c'est déjà une date valide
    if (dateInput instanceof Date) {
      return this.calculateTimeDifference(dateInput);
    }
    
    // Si c'est une string
    if (typeof dateInput === 'string') {
      // Correction du format problématique (ex: "2025-04-11120:53:09" -> "2025-04-11 20:53:09")
      dateString = dateInput.replace(
        /(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})/, 
        '$1 $2'
      ).replace(',', '.');
    } else {
      return 'récemment';
    }
  
    // Parsing de la date corrigée
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.error('Date invalide après correction:', dateString);
      return 'récemment';
    }
  
    return this.calculateTimeDifference(date);
  }
  
  private calculateTimeDifference(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
  
    if (seconds < 60) return 'à l\'instant';
    if (seconds < 3600) return `il y a ${Math.floor(seconds/60)} min`;
    if (seconds < 86400) return `il y a ${Math.floor(seconds/3600)} h`;
    if (seconds < 2592000) return `il y a ${Math.floor(seconds/86400)} j`;
    return `il y a ${Math.floor(seconds/2592000)} mois`;
  }
  
  private monthToNumber(month: string): number {
    const months = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    return months.indexOf(month);
  }
  sidebarToggle() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const html = document.getElementsByTagName('html')[0];

    if (this.mobile_menu_visible == 1) {
      html.classList.remove('nav-open');
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove('toggled');
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add('toggled');
      }, 430);

      var $layer = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');
      if (html.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (html.classList.contains('off-canvas-sidebar')) {
        document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add('visible');
      }, 100);

      $layer.onclick = function () {
        html.classList.remove('nav-open');
        this.mobile_menu_visible = 0;
        $layer.classList.remove('visible');
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      }.bind(this);

      html.classList.add('nav-open');
      this.mobile_menu_visible = 1;
    }
  }
  

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(2);
    }
    titlee = titlee.split('/').pop();

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return titlee;
  }
  markAllAsRead() {
    this.notifications.forEach(n => {
      if (!n.vue) this.markAsRead(n.id);
    });
  }
  clearReadNotifications() {
    this.notifications = this.notifications.filter(n => !n.vue);
  }
  playNotificationSound() {
    const audio = new Audio('assets/Son de notification snapchat.mp3');
    audio.play();
  }
  
  

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
