import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementNavComponent } from './element-nav.component';

describe('ElementNavComponent', () => {
  let component: ElementNavComponent;
  let fixture: ComponentFixture<ElementNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
