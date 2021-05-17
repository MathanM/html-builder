import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtBoardNavComponent } from './art-board-nav.component';

describe('ArtBoardNavComponent', () => {
  let component: ArtBoardNavComponent;
  let fixture: ComponentFixture<ArtBoardNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtBoardNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtBoardNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
