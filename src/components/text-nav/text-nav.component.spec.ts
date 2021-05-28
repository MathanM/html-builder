import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextNavComponent } from './text-nav.component';

describe('TextNavComponent', () => {
  let component: TextNavComponent;
  let fixture: ComponentFixture<TextNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
