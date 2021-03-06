import {Component, ElementRef, HostBinding, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, Subject} from "rxjs";
import {switchMapTo, takeUntil, tap} from "rxjs/operators";
import {DOCUMENT} from "@angular/common";
import {eventPosition} from "../../models/constant";

@Component({
  selector: 'app-xd-handle',
  templateUrl: './xd-handle.component.html',
  styleUrls: ['./xd-handle.component.scss']
})
export class XdHandleComponent implements OnInit, OnDestroy {
  _prop!: string;
  @Input() axis: string = 'x';
  @Input() set property(prop: string){
    this._prop = prop;
    this.initHandlePosition();
  }
  get property(){
    return this._prop;
  }
  @Input() set reInitHandles(flag: boolean){
    if(flag){
      this.initHandlePosition();
    }
  }
  startValue: number = 0;
  currentValue: number = 0;
  private destroy$ = new Subject<void>();

  @HostBinding('attr.contenteditable') edit = false;

  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    const host = element.parentElement;
    const mousedown$: Observable<MouseEvent> = fromEvent(element, 'mousedown');
    const mousemove$: Observable<Event> = fromEvent(document, 'mousemove');
    const mouseup$: Observable<Event> = fromEvent(document, 'mouseup');
    const root: any = document.querySelector(':root');
    //Handle Drag Events
    mousedown$.pipe(
      tap((e: MouseEvent) => {
        e.stopPropagation();
        const pos = eventPosition(e);
        if (this.property == 'size') {
          if (this.axis == 'x' || this.axis == '-x') {
            this.startValue = pos[0];
            this.currentValue = host.clientWidth;
          } else {
            this.startValue = pos[1];
            this.currentValue = host.clientHeight;
          }
        }else if (this.property == 'padding'){
          if(this.axis == 'x'){
            this.startValue = pos[0];
            this.currentValue = parseInt(host.style.paddingLeft) || 0;
            element.style.left = this.currentValue + 'px';
          }else if(this.axis == '-x'){
            this.startValue = pos[0];
            this.currentValue = parseInt(host.style.paddingRight) || 0;
            element.style.right = this.currentValue + 'px';
          }else if(this.axis == 'y'){
            this.startValue = pos[1];
            this.currentValue = parseInt(host.style.paddingTop) || 0;
            element.style.top = this.currentValue + 'px';
          }else if(this.axis == '-y'){
            this.startValue = pos[1];
            this.currentValue = parseInt(host.style.paddingBottom) || 0;
            element.style.bottom = this.currentValue + 'px';
          }
        }else if(this.property == 'margin'){
          if(this.axis == 'x'){
            this.startValue = pos[0];
            this.currentValue = parseInt(host.style.marginLeft) || 0;
            element.style.left = this.currentValue * -1 + 'px';
          }else if(this.axis == '-x'){
            this.startValue = pos[0];
            this.currentValue = parseInt(host.style.marginRight) || 0;
            element.style.right = this.currentValue * -1 + 'px';
          }else if(this.axis == 'y'){
            this.startValue = pos[1];
            this.currentValue = parseInt(host.style.marginTop) || 0;
            element.style.top = this.currentValue * -1 + 'px';
          }else if(this.axis == '-y'){
            this.startValue = pos[1];
            this.currentValue = parseInt(host.style.marginBottom) || 0;
            element.style.bottom = this.currentValue * -1 + 'px';
          }
        }
      }),
      switchMapTo(mousemove$.pipe(
        tap((e: Event) => {
          const pos = eventPosition(e as MouseEvent);
          if (this.property === 'size') {
            if (this.axis == 'x' || this.axis == '-x') {
              host.style.width = (this.currentValue + pos[0] - this.startValue) + 'px';
            } else {
              host.style.height = (this.currentValue + pos[1] - this.startValue) + 'px';
            }
          }else if (this.property == 'padding'){
            if(this.axis == 'x'){
              host.style.paddingLeft = (this.currentValue + pos[0] - this.startValue) + 'px';
              element.style.left = host.style.paddingLeft;
              root.style.setProperty('--xd-pl', host.style.paddingLeft);
            }else if (this.axis == '-x'){
              host.style.paddingRight = (this.currentValue + ((pos[0] - this.startValue) * -1)) + 'px';
              element.style.right = host.style.paddingRight;
              root.style.setProperty('--xd-pr', host.style.paddingRight);
            }else if(this.axis == 'y'){
              host.style.paddingTop = (this.currentValue + pos[1] - this.startValue) + 'px';
              element.style.top = host.style.paddingTop;
              root.style.setProperty('--xd-pt', host.style.paddingTop);
            }else if (this.axis == '-y'){
              host.style.paddingBottom = (this.currentValue + ((pos[1] - this.startValue) * -1)) + 'px';
              element.style.bottom = host.style.paddingBottom;
              root.style.setProperty('--xd-pb', host.style.paddingBottom);
            }
          }else if(this.property == 'margin'){
            let valueX = (this.currentValue + pos[0] - this.startValue);
            let valueY = (this.currentValue + pos[1] - this.startValue);
            if(this.axis == 'x'){
              host.style.marginLeft = valueX + 'px';
              element.style.left = (valueX * -1) + 'px';
              root.style.setProperty('--xd-ml', valueX+'px');
            }else if(this.axis == '-x'){
              host.style.marginRight = valueX + 'px';
              element.style.right = (valueX * -1) + 'px';
              root.style.setProperty('--xd-mr', valueX+'px');
            }else if(this.axis == 'y'){
              host.style.marginTop = valueY + 'px';
              element.style.top = (valueY * -1) + 'px';
              root.style.setProperty('--xd-mt', valueY+'px');
            }else if(this.axis == '-y'){
              host.style.marginBottom = valueY + 'px';
              element.style.bottom = (valueY * -1) + 'px';
              root.style.setProperty('--xd-mb', valueY+'px');
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
  initHandlePosition(){
    const element = this.elementRef.nativeElement;
    const root: any = document.querySelector(':root');
    const host = element.parentElement;
    // Init handle positions
    if(this.property == 'size'){
      if(this.axis == 'x'){
        element.style.left = '0px';
      }else if(this.axis == '-x'){
        element.style.right = '0px'
      }else if(this.axis == 'y'){
        element.style.top = '0px';
      }else if(this.axis == '-y'){
        element.style.bottom = '0px'
      }
    }else if(this.property == 'padding'){
      let value = 0;
      if(this.axis == 'x'){
        value = parseInt(host.style.paddingLeft) || 0;
        element.style.left = value + 'px';
        root.style.setProperty('--xd-pl', element.style.left);
      }else if(this.axis == '-x'){
        value = parseInt(host.style.paddingRight) || 0;
        element.style.right = value + 'px';
        root.style.setProperty('--xd-pr', element.style.right);
      }else if(this.axis == 'y'){
        value = parseInt(host.style.paddingTop) || 0;
        element.style.top = value + 'px';
        root.style.setProperty('--xd-pt', element.style.top);
      }else if(this.axis == '-y'){
        value = parseInt(host.style.paddingBottom) || 0;
        element.style.bottom = value + 'px';
        root.style.setProperty('--xd-pb', element.style.bottom);
      }
    }else if(this.property == "margin"){
      let value = 0;
      if(this.axis == 'x'){
        value = parseInt(host.style.marginLeft) || 0;
        element.style.left = value * -1 + 'px';
        root.style.setProperty('--xd-ml', value+'px');
      }else if(this.axis == '-x'){
        value = parseInt(host.style.marginRight) || 0;
        element.style.right = value * -1 + 'px';
        root.style.setProperty('--xd-mr', value+'px');
      }else if(this.axis == 'y'){
        value = parseInt(host.style.marginTop) || 0;
        element.style.top = value * -1 + 'px';
        root.style.setProperty('--xd-mt', value+'px');
      }else if(this.axis == '-y'){
        value = parseInt(host.style.marginBottom) || 0;
        element.style.bottom = value * -1 + 'px';
        root.style.setProperty('--xd-mb', value+'px');
      }
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
  }


}
