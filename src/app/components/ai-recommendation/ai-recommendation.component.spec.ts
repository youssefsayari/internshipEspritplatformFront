import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiRecommendationComponent } from './ai-recommendation.component';

describe('AiRecommendationComponent', () => {
  let component: AiRecommendationComponent;
  let fixture: ComponentFixture<AiRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiRecommendationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
