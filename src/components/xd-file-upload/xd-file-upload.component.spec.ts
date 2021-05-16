import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdFileUploadComponent } from './xd-file-upload.component';

describe('XdFileUploadComponent', () => {
  let component: XdFileUploadComponent;
  let fixture: ComponentFixture<XdFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
