import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdCheckboxComponent } from './xd-checkbox.component';

describe('XdCheckboxComponent', () => {
  let component: XdCheckboxComponent;
  let fixture: ComponentFixture<XdCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
