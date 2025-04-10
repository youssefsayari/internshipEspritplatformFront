import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseListComponent } from './defense-list.component';

describe('DefenseListComponent', () => {
  let component: DefenseListComponent;
  let fixture: ComponentFixture<DefenseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefenseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
