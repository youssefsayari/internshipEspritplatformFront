import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefenseComponent } from './add-defense.component';

describe('AddDefenseComponent', () => {
  let component: AddDefenseComponent;
  let fixture: ComponentFixture<AddDefenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDefenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
