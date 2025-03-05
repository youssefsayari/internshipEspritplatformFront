import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentUpdateMeetingComponent } from './student-update-meeting.component';

describe('StudentUpdateMeetingComponent', () => {
  let component: StudentUpdateMeetingComponent;
  let fixture: ComponentFixture<StudentUpdateMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentUpdateMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentUpdateMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
