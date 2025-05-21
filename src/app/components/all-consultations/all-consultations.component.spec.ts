import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllConsultationsComponent } from './all-consultations.component';

describe('AllConsultationsComponent', () => {
  let component: AllConsultationsComponent;
  let fixture: ComponentFixture<AllConsultationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllConsultationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
