import {Component, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {Subject} from "rxjs";
import {StateService} from "../../services/state.service";
import {takeUntil, tap} from "rxjs/operators";
import {pick} from 'lodash';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss']
})
export class ElementComponent implements OnInit {
  @Input() xdId!: string;
  destroy$: Subject<void> = new Subject<void>();
  elementData!: any;
  styleChange = () => {
    const elementData = pick(this.elementRef.nativeElement.style, ['width','height','backgroundColor','borderColor']);
    this.state.updateStyleData('element-'+this.xdId, elementData);
  }
  styleObserver$ = new MutationObserver(this.styleChange);
  constructor(private state: StateService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit() {
    this.watchStyles();
    this.state.styleData.pipe(
      tap((styleData: any) => {
        if(styleData[`element-${this.xdId}`]){
          this.watchStyles(false);
          this.elementData = styleData[`element-${this.xdId}`];
          this.updateStyles();
          setTimeout(() => {
            this.watchStyles();
          })
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  @HostListener('mousedown', ['$event'])
  onElementClick(e: MouseEvent): void {
    e.stopPropagation();
    this.state.activeItem.next('element-'+this.xdId);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateStyles(){
    if(this.elementData){
      Object.keys(this.elementData).forEach(style => {
        this.renderer.setStyle(this.elementRef.nativeElement, style, this.elementData[style]);
      });
    }
  }
  watchStyles(watch: boolean = true){
    if(watch){
      this.styleObserver$.observe(this.elementRef.nativeElement, {
        attributes: true,
        attributeFilter: ['style']
      });
    }else{
      this.styleObserver$.disconnect();
    }
  }
}
