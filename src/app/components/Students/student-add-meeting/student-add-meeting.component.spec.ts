import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAddMeetingComponent } from './student-add-meeting.component';

describe('StudentAddMeetingComponent', () => {
  let component: StudentAddMeetingComponent;
  let fixture: ComponentFixture<StudentAddMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAddMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAddMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
