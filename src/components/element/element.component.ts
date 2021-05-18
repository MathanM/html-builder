import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {StateService} from "../../services/state.service";
import {takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss']
})
export class ElementComponent {
  @Input() xdId!: string;
  destroy$: Subject<void> = new Subject<void>();

  constructor(private state: StateService) { }

  @HostListener('mousedown', ['$event'])
  onElementClick(e: MouseEvent): void {
    e.stopPropagation();
    this.state.activeItem.next('element-'+this.xdId);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
