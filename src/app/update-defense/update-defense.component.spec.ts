import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDefenseComponent } from './update-defense.component';

describe('UpdateDefenseComponent', () => {
  let component: UpdateDefenseComponent;
  let fixture: ComponentFixture<UpdateDefenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDefenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDefenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
