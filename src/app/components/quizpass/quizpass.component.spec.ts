import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizPassComponent } from './quizpass.component';

describe('QuizPassComponent', () => {
  let component: QuizPassComponent;
  let fixture: ComponentFixture<QuizPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
