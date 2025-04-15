import { Component, OnInit } from '@angular/core';
import { QuizService } from '../Services/quiz.service';
import { Quiz } from '../models/quiz';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-quiz-list-user',
  templateUrl: './quiz-list-user.component.html',
  styleUrls: ['./quiz-list-user.component.scss'],
  providers: [DatePipe]
})
export class QuizListUserComponent implements OnInit {
  quizzes: Quiz[] = [];
  hoveredQuizDate: string = ''; // Message à afficher quand on survole le bouton

  constructor(private quizService: QuizService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe((response: any) => {
      console.log('Quizzes récupérés:', response);
      this.quizzes = response;
    });
  }

  // Méthode pour vérifier si la date du quiz est passée ou non
  isQuizPassable(quizDate: string): boolean {
    const currentDate = new Date();
    const quizPassDate = new Date(quizDate);

    // Réinitialise l'heure du quiz à 9h00
    quizPassDate.setHours(14, 29, 0, 0);

    // La période de validité du quiz est de 1 minute
    const quizExpiryDate = new Date(quizPassDate.getTime() + 1 * 60 * 1000); // Ajoute 1 minute

    // Le quiz est disponible si la date actuelle est entre la date de passage et 1 minute après
    return currentDate >= quizPassDate && currentDate <= quizExpiryDate;
  }

  // Affichage du message de la date de passage quand on survole le bouton
 
}
