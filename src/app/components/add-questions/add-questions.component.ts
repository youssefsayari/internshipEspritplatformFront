import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { QuestionService } from '../../Services/question.service';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {
  questionForm: FormGroup;

  triviaQuestions: any[] = [];
  quizId: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
  ) {}

  ngOnInit(): void {
    this.quizId = +this.activatedRoute.snapshot.paramMap.get('id')!;

    // Initialiser le formulaire
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      reponse_correcte: ['', Validators.required]
    });
  }

  fillFormWithTriviaQuestion(): void {
    // Récupérer une question trivia depuis l'API
    this.questionService.getTriviaQuestions().subscribe(data => {
      this.triviaQuestions = data.results;
  
      // Si des questions trivia sont disponibles
      if (this.triviaQuestions.length > 0) {
        const trivia = this.triviaQuestions[0];
        // Mélanger les réponses incorrectes avec la réponse correcte
        const allAnswers = [...trivia.incorrect_answers, trivia.correct_answer];
  
        // Mélanger les réponses
        this.shuffleArray(allAnswers);
  
        // Remplir le formulaire avec la question trivia récupérée
        this.questionForm.patchValue({
          question: trivia.question,
          option1: allAnswers[0],
          option2: allAnswers[1],
          option3: allAnswers[2],
          option4: allAnswers[3],
          reponse_correcte: allAnswers.indexOf(trivia.correct_answer) + 1 // Trouver l'index de la réponse correcte
        });
      }
    });
  }
  
  // Fonction pour mélanger les éléments d'un tableau
  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments
    }
  }
  

  onSubmit(): void {
    if (this.questionForm.valid) {
      const newQuestion = {
        question: this.questionForm.value.question,
        option1: this.questionForm.value.option1,
        option2: this.questionForm.value.option2,
        option3: this.questionForm.value.option3,
        option4: this.questionForm.value.option4,
        reponse_correcte: this.questionForm.value.reponse_correcte
      };

      // Assurez-vous d'appeler le service pour ajouter la question
      this.questionService.addQuestionAndAssignToQuiz(newQuestion, this.quizId).subscribe(() => {
        Swal.fire('Success!', 'Question added successfully.', 'success');
        this.questionForm.reset();
      });
    }
  }

  finishAddingQuestions(): void {
    Swal.fire({
      title: 'Finish adding questions and confirming the quiz adding?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, finish',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/quiz-list']);
      }
    });
  }
}
