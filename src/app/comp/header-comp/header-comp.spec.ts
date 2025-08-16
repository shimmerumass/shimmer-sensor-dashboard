import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComp } from './header-comp';

describe('HeaderComp', () => {
  let component: HeaderComp;
  let fixture: ComponentFixture<HeaderComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
