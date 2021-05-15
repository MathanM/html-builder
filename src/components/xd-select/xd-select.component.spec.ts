import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdSelectComponent } from './xd-select.component';

describe('XdSelectComponent', () => {
  let component: XdSelectComponent;
  let fixture: ComponentFixture<XdSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
