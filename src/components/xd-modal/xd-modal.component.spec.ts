import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdModalComponent } from './xd-modal.component';

describe('XdModalComponent', () => {
  let component: XdModalComponent;
  let fixture: ComponentFixture<XdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
