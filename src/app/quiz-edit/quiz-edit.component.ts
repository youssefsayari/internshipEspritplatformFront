import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { QuestionReponse } from '../models/questionreponse';
import { QuestionService } from '../services/question.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
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
    private questionService: QuestionService,
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

      this.quizForm = this.fb.group({
        titre: [quiz.titre, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        description: [quiz.description, [Validators.required, Validators.minLength(10)]],
        date_passage: [datePassage, [Validators.required, this.dateValidator]],
        questions: this.fb.array(quiz.questions.map(q => this.fb.group({
          idQuestionReponse: [q.idQuestionReponse],
          question: [q.question, Validators.required],
          option1: [q.option1, Validators.required],
          option2: [q.option2, Validators.required],
          option3: [q.option3, Validators.required],
          option4: [q.option4, Validators.required],
          reponse_correcte: [q.reponse_correcte, Validators.required]
        })))
      });
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

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

    // Mettre à jour les données du quiz
    const updatedQuiz: Quiz = {
      idQuiz: this.quizId,
      titre: this.quizForm.value.titre,
      description: this.quizForm.value.description,
      date_passage: this.quizForm.value.date_passage,
    };

    // Mise à jour du quiz
    this.quizService.updateQuiz(updatedQuiz).subscribe(() => {
      // Mettre à jour les questions
      const updatedQuestions = this.quizForm.value.questions.map((q) => ({
        idQuestionReponse: q.idQuestionReponse,
        question: q.question,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        reponse_correcte: q.reponse_correcte,
        quiz: { idQuiz: this.quizId },
      }));

      updatedQuestions.forEach((question) => {
        this.questionService.updateQuestion(question).subscribe(
          () => {
            console.log('Question mise à jour:', question);
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de la question', error);
          }
        );
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
