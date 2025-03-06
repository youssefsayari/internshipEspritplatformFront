import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummerInternshipComponent } from './summer-internship.component';

describe('SummerInternshipComponent', () => {
  let component: SummerInternshipComponent;
  let fixture: ComponentFixture<SummerInternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummerInternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummerInternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
