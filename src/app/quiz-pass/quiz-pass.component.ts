import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../Services/quiz.service';
import { QuestionService } from '../Services/question.service';
import { Quiz } from '../models/quiz';
import { QuestionReponse } from '../models/questionreponse';
import { QuizUserService } from '../Services/quiz-user.service';
import Swal from 'sweetalert2'; // Import de SweetAlert2

@Component({
  selector: 'app-quiz-pass',
  templateUrl: './quiz-pass.component.html',
  styleUrls: ['./quiz-pass.component.scss']
})
export class QuizPassComponent implements OnInit {
  quiz: Quiz;
  questions: QuestionReponse[] = [];
  userId: number = 1;
  selectedAnswers: { [key: string]: number } = {};

  timeLeft: number = 45; // 15 secondes
  timer: any;
  isQuizValidated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private questionService: QuestionService,
    private quizUserService: QuizUserService
  ) {}

  ngOnInit(): void {
    const idQuiz = +this.route.snapshot.paramMap.get('id');
    console.log('ID du quiz:', idQuiz);
    this.checkIfQuizAlreadyTaken(idQuiz);
  }

  checkIfQuizAlreadyTaken(idQuiz: number): void {
    this.quizUserService.hasUserTakenQuiz(this.userId, idQuiz).subscribe(
      (hasTaken: boolean) => {
        if (hasTaken) {
          Swal.fire({
            icon: 'warning',
            title: 'Quiz déjà passé !',
            text: 'Vous avez déjà passé ce quiz.',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/quiz-list']);
          });
        } else {
          this.loadQuiz(idQuiz);
          this.loadQuestions(idQuiz);
          this.startTimer();
        }
      },
      (error) => {
        console.error("Erreur lors de la vérification du quiz:", error);
      }
    );
  }

  loadQuiz(idQuiz: number): void {
    this.quizService.getQuizById(idQuiz).subscribe((quiz: Quiz) => {
      this.quiz = quiz;
    });
  }

  loadQuestions(idQuiz: number): void {
    this.questionService.getQuestionsByQuizId(idQuiz).subscribe(
      (questions: QuestionReponse[]) => {
        this.questions = questions;
      },
      (error) => {
        console.error('Erreur de récupération des questions:', error);
      }
    );
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
        if (!this.isQuizValidated) {
          // Si le quiz n'a pas encore été validé, on applique la pénalité
          this.saveScoreWithPenalty();
        }
      }
    }, 1000);
  }

  selectAnswer(questionId: number, optionIndex: number): void {
    this.selectedAnswers[questionId] = optionIndex;
  }

  validateQuiz(): void {
    if (this.isQuizValidated) return;

    let score = 0;
    let unansweredQuestions = 0;

    this.questions.forEach(question => {
      const selectedAnswer = this.selectedAnswers[question.idQuestionReponse];

      if (selectedAnswer === undefined) {
        unansweredQuestions++;
      } else if (Number(selectedAnswer) === Number(question.reponse_correcte)) {
        score++;
      }
    });

    if (unansweredQuestions > 0) {
      Swal.fire({
        icon: 'info',
        title: 'Réponse incomplète',
        text: 'Veuillez répondre à toutes les questions avant de valider !',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.saveScore(score);
  }

  saveScore(score: number): void {
    if (this.isQuizValidated) return;

    this.quizUserService.saveQuizResult({
      idUser: this.userId,
      idQuiz: +this.route.snapshot.paramMap.get('id'),
      score: score
    }).subscribe(response => {
      console.log('Score enregistré avec succès:', response);

      Swal.fire({
        icon: 'success',
        title: 'Quiz terminé !',
        html: `Votre score est de <b>${score}/${this.questions.length}</b>`,
        confirmButtonText: 'OK'
      }).then(() => {
        this.isQuizValidated = true;
        this.router.navigate(['/quiz-list']);
      });

    }, error => {
      console.error('Erreur lors de l’enregistrement du score:', error);

      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l’enregistrement du score.',
        confirmButtonText: 'OK'
      });
    });
  }

  saveScoreWithPenalty(): void {
    let score = 0;
    let answeredQuestions = 0;
    let penaltyPoints = 0;  // Initialiser la variable de pénalité
  
    this.questions.forEach(question => {
      const selectedAnswer = this.selectedAnswers[question.idQuestionReponse];
  
      if (selectedAnswer === undefined) {
        return; // Question non répondue
      } else if (Number(selectedAnswer) === Number(question.reponse_correcte)) {
        score++; // Question correcte
      }
  
      answeredQuestions++;
    });
  
    // Appliquer une pénalité de -1 pour chaque question non répondue
    const unansweredQuestions = this.questions.length - answeredQuestions;
    if (unansweredQuestions > 0) {
      penaltyPoints = unansweredQuestions;  // Nombre de questions non répondues
      score -= penaltyPoints;  // Réduire le score par la pénalité
    }
  
    // Empêcher que le score ne soit inférieur à 0
    if (score < 0) {
      score = 0;
    }
  
    // Générer le message pour SweetAlert en fonction de la pénalité
    let penaltyMessage = '';
    if (penaltyPoints > 0) {
      penaltyMessage = `Vous avez reçu une pénalité de <b>${penaltyPoints}</b> point${penaltyPoints > 1 ? 's' : ''} en raison de questions non répondues.`;
    }
  
    this.quizUserService.saveQuizResult({
      idUser: this.userId,
      idQuiz: +this.route.snapshot.paramMap.get('id'),
      score: score
    }).subscribe(response => {
      console.log('Score enregistré avec succès:', response);
  
      Swal.fire({
        icon: 'warning',
        title: 'Temps écoulé !',
        html: `Le temps est écoulé. Votre score est de <b>${score}/${this.questions.length}</b>. ${penaltyMessage}`,
        confirmButtonText: 'OK'
      }).then(() => {
        this.isQuizValidated = true;
        this.router.navigate(['/quiz-list-user']);
      });
  
    }, error => {
      console.error('Erreur lors de l’enregistrement du score:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l’enregistrement du score.',
        confirmButtonText: 'OK'
      });
    });
  }
  

  // Calcul du nombre de questions répondues
  get answeredQuestionsCount(): number {
    return Object.keys(this.selectedAnswers).length;
  }
}
