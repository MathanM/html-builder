import {Component, OnDestroy, OnInit} from '@angular/core';
import {StateService} from "../services/state.service";
import {Subject} from "rxjs";
import {distinctUntilChanged, takeUntil, tap} from "rxjs/operators";

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
      distinctUntilChanged(),
      tap((activeTab) => {
        this.activeTab = activeTab;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  createElement(){
    this.state.createElement();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
