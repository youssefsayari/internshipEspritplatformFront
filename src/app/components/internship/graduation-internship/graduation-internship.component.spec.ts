import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduationInternshipComponent } from './graduation-internship.component';

describe('GraduationInternshipComponent', () => {
  let component: GraduationInternshipComponent;
  let fixture: ComponentFixture<GraduationInternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraduationInternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduationInternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
