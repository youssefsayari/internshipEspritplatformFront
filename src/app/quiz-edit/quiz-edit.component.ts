import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../Services/quiz.service';
import { Quiz } from '../models/quiz';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.scss']
})
export class QuizEditComponent implements OnInit {
  quizForm: FormGroup;
  quizId: number;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.paramMap.get('id');
    this.loadQuizDetails();
  }

  loadQuizDetails(): void {
    this.quizService.getQuizById(this.quizId).subscribe((quiz: Quiz) => {
      const datePassage = new Date(quiz.date_passage).toISOString().split('T')[0];

      // Formulaire pour le quiz
      this.quizForm = this.fb.group({
        titre: [quiz.titre, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        description: [quiz.description, [Validators.required, Validators.minLength(10)]],
        date_passage: [datePassage, [Validators.required, this.dateValidator]],
      });
    });
  }

  // Validation de la date
  dateValidator(control): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const inputDate = new Date(control.value);
    if (inputDate <= currentDate) {
      return { 'dateInvalid': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.quizForm.invalid) {
      return;
    }

    // Créer un objet de quiz mis à jour
    const updatedQuiz: Quiz = {
      idQuiz: this.quizId,
      titre: this.quizForm.value.titre,
      description: this.quizForm.value.description,
      date_passage: this.quizForm.value.date_passage,
    };

    // Mise à jour du quiz
    this.quizService.updateQuiz(updatedQuiz).subscribe(() => {
      Swal.fire('Succès', 'Le quiz a été modifié avec succès.', 'success');
      this.router.navigate(['/quiz-list']);
    },
    (error) => {
      console.error('Erreur lors de la modification du quiz', error);
      Swal.fire('Erreur', 'Une erreur est survenue lors de la modification du quiz.', 'error');
    });
  }
}
