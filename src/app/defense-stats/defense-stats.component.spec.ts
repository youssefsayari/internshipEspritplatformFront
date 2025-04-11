import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseStatsComponent } from './defense-stats.component';

describe('DefenseStatsComponent', () => {
  let component: DefenseStatsComponent;
  let fixture: ComponentFixture<DefenseStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefenseStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefenseStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
