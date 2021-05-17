import {Directive, ElementRef, HostListener, Inject, Input, OnDestroy, Renderer2} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Directive({
  selector: '[elementHelper]',
})
export class ElementHelperDirective implements OnDestroy {
  @Input() property: string = 'width';
  @Input()
  set isActive(flag: boolean){
    if(flag){
      this.initDragHandle();
    }else{
      this.clearDragHandle();
    }
  }
  leftKnob!: HTMLDivElement;
  rightKnob!: HTMLDivElement;
  topKnob!: HTMLDivElement;
  bottomKnob!: HTMLDivElement;
  eventValue = {
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0
  }
  private rListener!: () => void;
  private lListener!: () => void;
  private tListener!: () => void;
  private bListener!: () => void;
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }
  @HostListener('mouseover') onMouseOver() {
    this.elementRef.nativeElement.style.outline = '1px solid var(--active-blue)'
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.style.outline = null;
  }
  initDragHandle(){
    const element = this.elementRef.nativeElement;
    if(!element.classList.contains('xd-handle-wrapper')){
      element.classList.add('xd-handle-wrapper');
      element.style.position = 'relative';
      this.leftKnob = document.createElement('div');
      this.leftKnob.className = 'xd-handle l-knob';
      this.rightKnob = document.createElement('div');
      this.rightKnob.className = 'xd-handle r-knob';
      this.topKnob = document.createElement('div');
      this.topKnob.className = 'xd-handle t-knob';
      this.bottomKnob = document.createElement('div');
      this.bottomKnob.className = 'xd-handle b-knob';
      this.renderer.appendChild(element, this.leftKnob);
      this.renderer.appendChild(element, this.rightKnob);
      this.renderer.appendChild(element, this.topKnob);
      this.renderer.appendChild(element, this.bottomKnob);
      this.initDragEvents();
    }
  }
  initDragEvents(){
    this.rListener = this.renderer.listen(this.rightKnob, 'mousedown', (e: MouseEvent) => {
      this.startDrag(e, 'x');
    });
    this.lListener = this.renderer.listen(this.leftKnob, 'mousedown', (e: MouseEvent) => {
      this.startDrag(e, 'x');
    });
    this.tListener = this.renderer.listen(this.topKnob, 'mousedown', (e: MouseEvent) => {
      this.startDrag(e, 'y');
    });
    this.bListener = this.renderer.listen(this.bottomKnob, 'mousedown', (e: MouseEvent) => {
      this.startDrag(e, 'y');
    });
  }
  startDrag(e: MouseEvent, axis?: string){
    e.preventDefault();
    e.stopImmediatePropagation();
    const element = this.elementRef.nativeElement;
    let onDragEve: any, endDragEve: any;
    if(this.property === 'width'){
      const pos = this.eventPosition(e);
      this.eventValue.startX = pos[0];
      this.eventValue.startY = pos[1];
      this.eventValue.currX = element.clientWidth;
      this.eventValue.currY = element.clientHeight;
      onDragEve = this.renderer.listen("document",'mousemove',(ev: MouseEvent) => {
        this.onDrag(ev, axis)
      });
      endDragEve = this.renderer.listen("document", 'mouseup', (event: MouseEvent) => {
        this.endDrag(event, onDragEve, endDragEve);
      })
    }
  }
  onDrag(e: MouseEvent, axis?: string){
    e.preventDefault();
    e.stopImmediatePropagation();
    const element = this.elementRef.nativeElement;
    const pos = this.eventPosition(e);
    if(this.property === 'width'){
      if(axis == 'x'){
        element.style.width = (this.eventValue.currX + pos[0] - this.eventValue.startX) + 'px';
      }else{
        element.style.height = (this.eventValue.currY + pos[1] - this.eventValue.startY) + 'px';
      }
    }
  }
  endDrag(e: MouseEvent, e1?: any, e2?: any){
    e.preventDefault();
    e.stopImmediatePropagation();
    e1();
    e2();
    this.eventValue = {
      startX: 0,
      startY: 0,
      currX: 0,
      currY: 0
    }
  }
  clearDragHandle(){
    const element = this.elementRef.nativeElement;
    if(element.classList.contains('xd-handle-wrapper')){
      element.classList.remove('xd-handle-wrapper');
      this.renderer.removeChild(element, this.leftKnob);
      this.renderer.removeChild(element, this.rightKnob);
      this.renderer.removeChild(element, this.topKnob);
      this.renderer.removeChild(element, this.bottomKnob);
    }
  }
  eventPosition(e: TouchEvent | MouseEvent){
    if (e instanceof TouchEvent) {
      return [e.touches[0].clientX, e.touches[0].clientY];
    }else{
      return [e.clientX, e.clientY];
    }
  }
  ngOnDestroy() {
    this.rListener();
    this.lListener();
    this.tListener();
    this.bListener();
  }
}
