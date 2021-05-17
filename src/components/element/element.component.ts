import {Component, HostListener, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {StateService} from "../../services/state.service";
import {takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss']
})
export class ElementComponent implements OnInit {
  active = false;
  destroy$: Subject<void> = new Subject<void>();

  constructor(private state: StateService) { }

  ngOnInit(): void {
    this.state.activeItem.pipe(
      tap((activeTab) => {
        this.active = activeTab == 'element';
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  @HostListener('click', ['$event'])
  onElementClick(e: MouseEvent): void {
    e.stopPropagation();
    this.state.activeItem.next('element');
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
