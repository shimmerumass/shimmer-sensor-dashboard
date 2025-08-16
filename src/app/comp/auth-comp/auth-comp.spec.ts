import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComp } from './auth-comp';

describe('AuthComp', () => {
  let component: AuthComp;
  let fixture: ComponentFixture<AuthComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
