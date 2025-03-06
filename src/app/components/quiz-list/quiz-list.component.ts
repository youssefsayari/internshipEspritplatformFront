import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../Services/quiz.service';
import { Quiz } from '../../models/quiz';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  page: number = 1;
  itemsPerPage: number = 6;
  totalQuizzes: number = 0;

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe((data: Quiz[]) => {
      this.quizzes = data;
      this.totalQuizzes = data.length;
    });
  }

  deleteQuiz(idQuiz: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You can\'t go back!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.quizService.deleteQuiz(idQuiz).subscribe(
          () => {
            this.quizzes = this.quizzes.filter(quiz => quiz.idQuiz !== idQuiz);
            Swal.fire('Deleted!', 'The quiz is deleted.', 'success');
          },
          error => {
            console.error('Error deleting quiz', error);
            Swal.fire('Error!', 'Error while deleting quiz.', 'error');
          }
        );
      }
    });
  }

  // Pagination logic to get quizzes for the current page
  get paginatedQuizzes(): Quiz[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.quizzes.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Calculate the total number of pages (rounded up)
  get totalPages(): number {
    return Math.ceil(this.totalQuizzes / this.itemsPerPage);
  }

  // Handle page change
  onPageChange(page: number): void {
    this.page = page;
  }
}
