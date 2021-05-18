import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {StateService} from "../../services/state.service";
import {takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {ArtBoardModel} from "../../models/art-board.model";
import {isEmpty} from "lodash";

@Component({
  selector: 'app-art-board',
  templateUrl: './art-board.component.html',
  styleUrls: ['./art-board.component.scss']
})
export class ArtBoardComponent implements OnInit, OnDestroy {
  active = false;
  destroy$: Subject<void> = new Subject<void>();
  artBoard!: ArtBoardModel;
  designHelper = false;
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
        this.checkDesignHelper();
      })
    ).subscribe();
  }

  @HostListener('mousedown', ['$event'])
  onArtBoardClick(e: MouseEvent): void {
    e.stopPropagation();
    this.state.activeItem.next('artboard');
  }

  checkDesignHelper(){
    if(this.artBoard && !isEmpty(this.artBoard.designHelper)){
      this.designHelper = true
      const root: any = document.querySelector(':root');
      if (root) {
        root.style.setProperty('--design-helper-width', this.artBoard.designHelper.width);
        root.style.setProperty('--design-helper-height', this.artBoard.designHelper.height);
        root.style.setProperty('--design-helper-offset', this.artBoard.designHelper.top);
        root.style.setProperty('--design-helper-url', `url(${this.artBoard.designHelper.url})`);
        root.style.setProperty('--design-helper-opacity', this.artBoard.designHelper.toggle?0.5:0);
      }
    }else{
      this.designHelper = false;
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
