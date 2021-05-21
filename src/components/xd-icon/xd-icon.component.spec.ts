import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdIconComponent } from './xd-icon.component';

describe('XdIconComponent', () => {
  let component: XdIconComponent;
  let fixture: ComponentFixture<XdIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
