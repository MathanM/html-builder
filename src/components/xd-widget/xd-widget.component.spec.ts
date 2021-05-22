import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdWidgetComponent } from './xd-widget.component';

describe('XdWidgetComponent', () => {
  let component: XdWidgetComponent;
  let fixture: ComponentFixture<XdWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
