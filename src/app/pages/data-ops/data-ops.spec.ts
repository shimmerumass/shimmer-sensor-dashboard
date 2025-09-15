import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataOps } from './data-ops';

describe('DataOps', () => {
  let component: DataOps;
  let fixture: ComponentFixture<DataOps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataOps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataOps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
