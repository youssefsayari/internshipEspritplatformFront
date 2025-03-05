import { Component } from '@angular/core';

interface msgs {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-my-contacts',
  templateUrl: './my-contacts.component.html',
  styleUrls: ['./my-contacts.component.css']

})
export class MyContactsComponent {
  // This is for Mymessages
  msgs: msgs[] = [
    {
      id: 1,
      img: '/assets/images/profile/user-1.jpg',
      title: 'Andrew McDownland',
      subtitle: 'info@wrappixel.com',
    },
    {
      id: 2,
      img: '/assets/images/profile/user-2.jpg',
      title: 'Christopher Jamil',
      subtitle: 'pamela1987@gmail.com',
    },
    {
      id: 3,
      img: '/assets/images/profile/user-3.jpg',
      title: 'Julia Roberts',
      subtitle: 'cruise1298.fiplip@gmail.com',
    },
    {
      id: 4,
      img: '/assets/images/profile/user-4.jpg',
      title: 'James Johnson',
      subtitle: 'kat@gmail.com',
    },
  ];

   // Fonction pour le suivi des éléments avec un identifiant unique
   trackByFn(index: number, item: msgs): number {
    return item.id;
  }

  constructor() { }
}
