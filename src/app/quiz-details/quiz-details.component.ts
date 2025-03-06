import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../Services/quiz.service';
import { QuestionService } from '../Services/question.service';
import { Quiz } from '../models/quiz';
import { QuestionReponse } from '../models/questionreponse';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss']
})
export class QuizDetailsComponent implements OnInit {
  quiz: Quiz;
  questions: QuestionReponse[] = [];
  quizId: number;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.paramMap.get('id');
    this.loadQuizDetails();
    this.loadQuestions();
  }

  loadQuizDetails(): void {
    this.quizService.getQuizById(this.quizId).subscribe(data => {
      this.quiz = data;
    });
  }

  loadQuestions(): void {
    this.questionService.getQuestionsByQuizId(this.quizId).subscribe(data => {
      this.questions = data;
    });
  }
}
