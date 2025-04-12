import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorCalendarComponent } from './tutor-calendar.component';

describe('TutorCalendarComponent', () => {
  let component: TutorCalendarComponent;
  let fixture: ComponentFixture<TutorCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
