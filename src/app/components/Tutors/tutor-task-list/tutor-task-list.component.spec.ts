import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorTaskListComponent } from './tutor-task-list.component';

describe('TutorTaskListComponent', () => {
  let component: TutorTaskListComponent;
  let fixture: ComponentFixture<TutorTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorTaskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
