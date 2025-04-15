import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationGridPreviewComponent } from './evaluation-grid-preview.component';

describe('EvaluationGridPreviewComponent', () => {
  let component: EvaluationGridPreviewComponent;
  let fixture: ComponentFixture<EvaluationGridPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationGridPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationGridPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
