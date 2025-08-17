import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewerComp } from './file-viewer-comp';

describe('FileViewerComp', () => {
  let component: FileViewerComp;
  let fixture: ComponentFixture<FileViewerComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileViewerComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileViewerComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
