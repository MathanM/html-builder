import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtBoardComponent } from './art-board.component';

describe('ArtBoardComponent', () => {
  let component: ArtBoardComponent;
  let fixture: ComponentFixture<ArtBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
