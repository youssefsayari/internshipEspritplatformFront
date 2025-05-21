import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationRequestComponent } from './consultation-request.component';

describe('ConsultationRequestComponent', () => {
  let component: ConsultationRequestComponent;
  let fixture: ComponentFixture<ConsultationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
