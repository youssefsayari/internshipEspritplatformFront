import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefensesTutorsComponent } from './defenses-tutors.component';

describe('DefensesTutorsComponent', () => {
  let component: DefensesTutorsComponent;
  let fixture: ComponentFixture<DefensesTutorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefensesTutorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefensesTutorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
