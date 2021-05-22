import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdMenuComponent } from './xd-menu.component';

describe('XdMenuComponent', () => {
  let component: XdMenuComponent;
  let fixture: ComponentFixture<XdMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
