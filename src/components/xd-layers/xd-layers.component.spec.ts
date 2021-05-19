import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XdLayersComponent } from './xd-layers.component';

describe('XdLayersComponent', () => {
  let component: XdLayersComponent;
  let fixture: ComponentFixture<XdLayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XdLayersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XdLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
