import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsultantComponent } from './add-consultant.component';

describe('AddConsultantComponent', () => {
  let component: AddConsultantComponent;
  let fixture: ComponentFixture<AddConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConsultantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
