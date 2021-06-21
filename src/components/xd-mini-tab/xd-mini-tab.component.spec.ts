import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdMiniTabComponent } from './xd-mini-tab.component';

describe('XdMiniTabComponent', () => {
  let component: XdMiniTabComponent;
  let fixture: ComponentFixture<XdMiniTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdMiniTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdMiniTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
