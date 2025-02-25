import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { QuestionService } from '../../services/question.service';
import { Quiz } from '../../models/quiz';
import { QuestionReponse } from '../../models/questionreponse';
import { QuizUserService } from '../../services/quiz-user.service';

@Component({
  selector: 'app-quiz-pass',
  templateUrl: './quizpass.component.html',
  styleUrls: ['./quizpass.component.scss']
})
export class QuizPassComponent implements OnInit {
  quiz: Quiz;
  questions: QuestionReponse[] = [];
  userId: number;
  selectedAnswers: { [key: string]: number } = {}; // Enregistre la réponse sélectionnée (index de l'option)

  // Timer variables
  timeLeft: number = 15; // 60 secondes
  timer: any; // Pour stocker l'intervalle du timer
  isQuizValidated: boolean = false; // Flag pour vérifier si le quiz a déjà été validé

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private questionService: QuestionService,
    private quizUserService: QuizUserService
  ) {}

  ngOnInit(): void {
    const idQuiz = +this.route.snapshot.paramMap.get('id');
    console.log('ID du quiz:', idQuiz);
    this.loadQuiz(idQuiz);
    this.loadQuestions(idQuiz);
    this.userId = 1;
    this.startTimer(); // Démarrer le timer quand le quiz commence
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

  // Démarre le timer
  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--; // Réduire le temps chaque seconde
      } else {
        clearInterval(this.timer); // Arrêter le timer quand il atteint 0
        if (!this.isQuizValidated) { // Appeler saveScore uniquement si le quiz n'a pas encore été validé
          this.saveScore(0); // Sauvegarder le score à 0 lorsque le temps est écoulé
        }
      }
    }, 1000);
  }

  // Sélectionner la réponse, chaque option a un index (1, 2, 3, ou 4)
  selectAnswer(questionId: number, optionIndex: number): void {
    this.selectedAnswers[questionId] = optionIndex; // Enregistre la réponse sélectionnée
  }

  // Valider le quiz et calculer le score
  validateQuiz(): void {
    if (this.isQuizValidated) return; // Ne pas valider deux fois

    let score = 0;
    let unansweredQuestions = 0;

    this.questions.forEach(question => {
      const selectedAnswer = this.selectedAnswers[question.idQuestionReponse]; // Récupère la réponse sélectionnée (index 1, 2, 3 ou 4)

      if (selectedAnswer === undefined) {
        unansweredQuestions += 1; // Si la question n'a pas de réponse
      } else {
        // Vérification si la réponse sélectionnée est correcte
        console.log(`Question ID: ${question.idQuestionReponse}, Réponse sélectionnée: ${selectedAnswer}, Réponse correcte: ${question.reponse_correcte}`);

        // Comparer correctement les réponses (en s'assurant que les valeurs sont bien comparées)
        if (Number(selectedAnswer) === Number(question.reponse_correcte)) {
          score++; // Ajoute au score si la réponse est correcte
        }
      }
    });
    console.log(`Score calculé: ${score}`);

    // Alerte si des questions n'ont pas été répondues
    if (unansweredQuestions > 0) {
      alert("Veuillez répondre à toutes les questions !");
      return;
    }

    // Sauvegarder le score
    this.saveScore(score);
  }

  // Sauvegarder le score
  saveScore(score: number): void {
    if (this.isQuizValidated) return; // Empêcher la double sauvegarde

    this.quizUserService.saveQuizResult({
      idUser: this.userId,
      idQuiz: +this.route.snapshot.paramMap.get('id'),
      score: score
    }).subscribe(response => {
      console.log('Score:', score);
      console.log('Score enregistré avec succès:', response);
      alert(`Quiz terminé ! Votre score est de ${score}/${this.questions.length}`);
      this.isQuizValidated = true; // Marquer le quiz comme validé pour éviter la double sauvegarde
    }, error => {
      console.error('Erreur lors de l’enregistrement du score:', error);
      alert("Erreur lors de l’enregistrement du score !");
    });
  }
}
