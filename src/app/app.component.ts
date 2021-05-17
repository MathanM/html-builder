import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StateService} from "../services/state.service";
import {Subject} from "rxjs";
import {takeUntil, tap, withLatestFrom} from "rxjs/operators";
import {ArtBoardModel, FileUploadEvent} from "../models/art-board.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  activeTab: string = '';
  destroy$: Subject<void> = new Subject<void>();

  constructor(private state: StateService) {}

  ngOnInit(): void {
    this.state.activeItem.pipe(
      tap((activeTab) => {
        this.activeTab = activeTab;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
