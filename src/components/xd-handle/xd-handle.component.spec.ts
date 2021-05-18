import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdHandleComponent } from './xd-handle.component';

describe('XdHandleComponent', () => {
  let component: XdHandleComponent;
  let fixture: ComponentFixture<XdHandleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdHandleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
