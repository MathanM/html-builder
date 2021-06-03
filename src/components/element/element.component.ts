import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {StateService} from "../../services/state.service";
import {pluck, takeUntil, tap} from "rxjs/operators";
import {pick} from 'lodash';
import {ElementHelperDirective} from "../../directives/element-helper.directive";
import {XDType} from "../../models/art-board.model";

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss']
})
export class ElementComponent extends ElementHelperDirective implements OnInit, OnDestroy {
  elementData!: any;
  isPasteEnable: boolean = false;
  type: string = XDType.Element;
  @HostListener('mousedown', ['$event'])
  onElementClick(e: MouseEvent): void {
    e.stopPropagation();
    this.state.activeItem.next(this.type+'-'+this.xdId);
  }

  styleChange = () => {
    const elementData = pick(
      this.elementRef.nativeElement.style,
      [
        'width',
        'height',
        'paddingLeft',
        'paddingRight',
        'paddingTop',
        'paddingBottom',
        'marginLeft',
        'marginRight',
        'marginTop',
        'marginBottom'
      ]
    );
    this.state.updateStyleData(this.type+'-'+this.xdId, elementData);
  }
  styleObserver$ = new MutationObserver(this.styleChange);

  constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected state: StateService
  ) {
    super(elementRef,renderer,componentFactoryResolver, state);
  }

  ngOnInit() {
    super.ngOnInit();
    this.watchStyles();
    this.state.styleData.pipe(
      pluck(`${this.type}-${this.xdId}`),
      tap((elementStyle: any) => {
        if(elementStyle){
          this.watchStyles(false);
          this.elementData = elementStyle;
          this.updateStyles();
          this.onStyleData();
          setTimeout(() => {
            this.watchStyles();
          })
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.state.activeUtility.pipe(
      tap((prop) => {
        this.property = prop.toLowerCase();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.state.copyId.pipe(
      tap((copy) => {
        this.isPasteEnable = !copy.id;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  updateStyles(){
    if(this.elementData){
      Object.keys(this.elementData).forEach(style => {
        this.renderer.setStyle(this.elementRef.nativeElement, style, this.elementData[style]);
      });
    }
    this.rePositionHandles();
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
  deleteElement(){
    this.state.deleteElement(this.type+'-'+this.xdId);
    this.elementRef.nativeElement.remove();
  }
  copyElement(){
    this.state.copyElement(this.type+'-'+this.xdId);
  }
  pasteElement(){
    this.state.pasteElement();
  }
  onStyleData(){}
  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
