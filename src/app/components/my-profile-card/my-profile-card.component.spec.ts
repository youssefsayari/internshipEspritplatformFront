import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileCardComponent } from './my-profile-card.component';

describe('MyProfileCardComponent', () => {
  let component: MyProfileCardComponent;
  let fixture: ComponentFixture<MyProfileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProfileCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
