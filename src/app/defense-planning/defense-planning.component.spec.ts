import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefensePlanningComponent } from './defense-planning.component';

describe('DefensePlanningComponent', () => {
  let component: DefensePlanningComponent;
  let fixture: ComponentFixture<DefensePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefensePlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefensePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
