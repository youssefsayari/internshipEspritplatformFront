import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDefenseComponent } from './student-defense.component';

describe('StudentDefenseComponent', () => {
  let component: StudentDefenseComponent;
  let fixture: ComponentFixture<StudentDefenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentDefenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDefenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
