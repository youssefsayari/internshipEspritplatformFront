import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMeetingsComponent } from './student-meetings.component';

describe('StudentMeetingsComponent', () => {
  let component: StudentMeetingsComponent;
  let fixture: ComponentFixture<StudentMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentMeetingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
