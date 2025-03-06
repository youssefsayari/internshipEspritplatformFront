import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../Services/quiz.service';
import { Quiz } from '../../models/quiz';
import Swal from 'sweetalert2';
import { UserService } from "../../Services/user.service";

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent implements OnInit {
  quizForm: FormGroup;
  idCompany : string =localStorage.getItem('userClasse');
  constructor(
    private formBuilder: FormBuilder,
    private quizService: QuizService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.quizForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date_passage: ['', [Validators.required, this.futureDateValidator]]
    });
  }

  // Validateur personnalisé pour vérifier que la date est dans le futur
  futureDateValidator(control: any) {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate <= currentDate) {
      return { futureDate: true }; // La date doit être dans le futur
    }
    return null; // Pas d'erreur
  }

  fetchUserDetails() {
      const token = localStorage.getItem('Token');
      if (!token) return;
  
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          localStorage.setItem('userRole', userDetails.role);
          localStorage.setItem('userClasse', userDetails.classe);
        },
        error: () => {
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
        }
      });
    }

  onSubmit(): void {
    if (this.quizForm.valid) {
      const newQuiz: Quiz = {
        titre: this.quizForm.value.titre,
        description: this.quizForm.value.description,
        date_passage: this.quizForm.value.date_passage
      };

      this.quizService.addQuizAndAssignToSociete(newQuiz, Number(this.idCompany)).subscribe(
        (quiz: Quiz) => {
          console.log('✅ Réponse de l’API:', quiz);
          if (quiz && quiz.idQuiz) {
            console.log('🔄 Redirection vers:', `/add-questions/${quiz.idQuiz}`);
            this.router.navigate(['/add-questions', quiz.idQuiz]);
          } else {
            console.error('❌ Problème: ID du quiz non défini !');
          }
        },
        (error) => {
          console.error('❌ Erreur API:', error);
        }
      );
    }
  }
}
