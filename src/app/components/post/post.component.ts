import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Post} from "../../models/post";
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import {InternshipService} from "../../services/internship.service";
import {InternshipAddrequest} from "../../models/internship-addrequest";

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
          if (userDetails.id) {
            const internshipAddRequest = {
              idUser: userDetails.id,
              idPost: postId
            };
            this.internshipService.addInternship(internshipAddRequest).subscribe({
              next: (response) => {
                console.log(response); // Affiche "Internship request submitted successfully!"
                alert("Votre demande de stage a été soumise avec succès !");
              },
              error: (err) => {
                console.error("Erreur lors de la soumission du stage :", err);
                alert("Une erreur s'est produite lors de la demande de stage.");
              }
            });
          }
        },
        error: (err) => {
          console.log('Error fetching user details:', err);
        }});


  }

}
