import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {StateService} from "../../services/state.service";
import {takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {ArtBoardModel} from "../../models/art-board.model";

@Component({
  selector: 'app-art-board',
  templateUrl: './art-board.component.html',
  styleUrls: ['./art-board.component.scss']
})
export class ArtBoardComponent implements OnInit, OnDestroy {
  active = false;
  destroy$: Subject<void> = new Subject<void>();
  artBoard!: ArtBoardModel;
  constructor(private state: StateService) {}

  ngOnInit(): void {
    this.state.activeItem.pipe(
      tap((activeTab) => {
        this.active = activeTab == 'artboard';
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.state.styleData.pipe(
      tap((data:any) => {
        this.artBoard = data.artBoard;
      })
    ).subscribe();
  }

  @HostListener('click', ['$event'])
  onArtBoardClick(e: MouseEvent): void {
    e.stopPropagation();
    this.state.activeItem.next('artboard');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
