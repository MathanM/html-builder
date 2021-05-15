import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdColorPickerComponent } from './xd-color-picker.component';

describe('XdColorPickerComponent', () => {
  let component: XdColorPickerComponent;
  let fixture: ComponentFixture<XdColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdColorPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
