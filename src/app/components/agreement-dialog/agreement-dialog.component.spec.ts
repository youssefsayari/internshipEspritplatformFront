import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementDialogComponent } from './agreement-dialog.component';

describe('AgreementDialogComponent', () => {
  let component: AgreementDialogComponent;
  let fixture: ComponentFixture<AgreementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
