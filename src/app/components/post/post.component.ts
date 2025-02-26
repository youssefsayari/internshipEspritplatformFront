import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Post} from "../../models/post";
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import {InternshipService} from "../../services/internship.service";
import {InternshipAddrequest} from "../../models/internship-addrequest";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  id: number;
  constructor(private router: Router, private postService: PostService, private userService: UserService, private internshipService: InternshipService) { }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe((data: Post[]) => {
      this.posts = data;
    });
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('Token');

    if (!token || !userRole) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }
  }

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
