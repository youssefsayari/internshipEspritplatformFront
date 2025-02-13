import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentStageComponent } from './document-stage.component';

describe('DocumentStageComponent', () => {
  let component: DocumentStageComponent;
  let fixture: ComponentFixture<DocumentStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentStageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
