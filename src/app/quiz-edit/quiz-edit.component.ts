import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '../Services/question.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../Services/quiz.service';
import { Quiz } from '../models/quiz';
import Swal from 'sweetalert2';
import { QuestionReponse } from '../models/questionreponse';

@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.scss']
})
export class QuizEditComponent implements OnInit {
  quizForm: FormGroup;
  questionForms: FormGroup[] = [];
  quizId: number;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private questionService: QuestionService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.paramMap.get('id');
    this.loadQuizDetails();
  }

  loadQuizDetails(): void {
    // Charger d'abord le quiz
    this.quizService.getQuizById(this.quizId).subscribe((quiz: Quiz) => {
      console.log(quiz.questions);
      const datePassage = new Date(quiz.date_passage).toISOString().split('T')[0];

      // Formulaire pour le quiz
      this.quizForm = this.fb.group({
        titre: [quiz.titre, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        description: [quiz.description, [Validators.required, Validators.minLength(10)]],
        date_passage: [datePassage, [Validators.required, this.dateValidator]],
      });

      // Maintenant, charger les questions associées au quiz
      this.questionService.getQuestionsByQuizId(this.quizId).subscribe((questions) => {
        // Création des formulaires pour chaque question
        questions.forEach((question) => {
          const questionForm = this.fb.group({
            idQuestionReponse: [question.idQuestionReponse],
            question: [question.question, Validators.required],
            option1: [question.option1, Validators.required],
            option2: [question.option2, Validators.required],
            option3: [question.option3, Validators.required],
            option4: [question.option4, Validators.required],
            reponse_correcte: [question.reponse_correcte, Validators.required]
          });
          this.questionForms.push(questionForm);
        });
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
      // Mise à jour des questions
      this.questionForms.forEach((questionForm) => {
        if (questionForm.valid) {
          const updatedQuestion: QuestionReponse = {
            idQuestionReponse: questionForm.value.idQuestionReponse,
            question: questionForm.value.question,
            option1: questionForm.value.option1,
            option2: questionForm.value.option2,
            option3: questionForm.value.option3,
            option4: questionForm.value.option4,
            reponse_correcte: questionForm.value.reponse_correcte,
            quiz: updatedQuiz // Vous passez l'objet `updatedQuiz` complet ici
          };

          this.questionService.updateQuestion(updatedQuestion).subscribe(
            () => {
              console.log('Question mise à jour:', updatedQuestion);
            },
            (error) => {
              console.error('Erreur lors de la mise à jour de la question', error);
            }
          );
        }
      });

      Swal.fire('Succès', 'Le quiz et ses questions ont été modifiés avec succès.', 'success');
      this.router.navigate(['/quiz-list']);
    },
    (error) => {
      console.error('Erreur lors de la modification du quiz', error);
      Swal.fire('Erreur', 'Une erreur est survenue lors de la modification du quiz.', 'error');
    });
  }
}
