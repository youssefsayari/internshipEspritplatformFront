import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseDetailsComponent } from './defense-details.component';

describe('DefenseDetailsComponent', () => {
  let component: DefenseDetailsComponent;
  let fixture: ComponentFixture<DefenseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefenseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
