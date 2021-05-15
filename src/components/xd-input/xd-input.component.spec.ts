import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdInputComponent } from './xd-input.component';

describe('XdInputComponent', () => {
  let component: XdInputComponent;
  let fixture: ComponentFixture<XdInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
