import {Component, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, Subject} from "rxjs";
import {switchMapTo, takeUntil, tap} from "rxjs/operators";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-xd-handle',
  templateUrl: './xd-handle.component.html',
  styleUrls: ['./xd-handle.component.scss']
})
export class XdHandleComponent implements OnInit, OnDestroy {
  @Input() axis: string = 'x';
  @Input() property: string = 'size';
  startValue: number = 0;
  currentValue: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    const host = element.parentElement;
    const mousedown$: Observable<MouseEvent> = fromEvent(element, 'mousedown');
    const mousemove$: Observable<Event> = fromEvent(document, 'mousemove');
    const mouseup$: Observable<Event> = fromEvent(document, 'mouseup');
    mousedown$.pipe(
      tap((e: MouseEvent) => {
        e.stopPropagation();
        const pos = XdHandleComponent.eventPosition(e);
        if (this.property == 'size') {
          if (this.axis == 'x') {
            this.startValue = pos[0];
            this.currentValue = host.clientWidth;
          } else {
            this.startValue = pos[1];
            this.currentValue = host.clientHeight;
          }
        }
      }),
      switchMapTo(mousemove$.pipe(
        tap((e: Event) => {
          const pos = XdHandleComponent.eventPosition(e as MouseEvent);
          if (this.property === 'size') {
            if (this.axis == 'x') {
              host.style.width = (this.currentValue + pos[0] - this.startValue) + 'px';
            } else {
              host.style.height = (this.currentValue + pos[1] - this.startValue) + 'px';
            }
          }
        }),
        takeUntil(mouseup$.pipe(tap((e: Event) => {
          e.stopPropagation();
          this.startValue = 0;
          this.currentValue = 0;
        })))
      )),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  static eventPosition(e: TouchEvent | MouseEvent) {
    if (e instanceof TouchEvent) {
      return [e.touches[0].clientX, e.touches[0].clientY];
    } else {
      return [e.clientX, e.clientY];
    }
  }
}
