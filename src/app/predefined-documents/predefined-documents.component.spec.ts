import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedDocumentsComponent } from './predefined-documents.component';

describe('PredefinedDocumentsComponent', () => {
  let component: PredefinedDocumentsComponent;
  let fixture: ComponentFixture<PredefinedDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
