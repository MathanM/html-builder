import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef, HostBinding, HostListener,
  Input, OnDestroy, OnInit,
  Renderer2, TemplateRef, ViewChild,
  ViewContainerRef
} from '@angular/core';
import {XdHandleComponent} from "../components/xd-handle/xd-handle.component";
import {StateService} from "../services/state.service";
import {distinctUntilChanged, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {XdMenuComponent} from "../components/xd-menu/xd-menu.component";
import {eventPosition} from "../models/constant";

@Directive({
  selector: '[elementHelper]',
})
export class ElementHelperDirective implements OnInit, OnDestroy {
  _property: string = 'size';
  @Input() xdId!: string;
  @Input() set property(prop: string){
    this.elementRef.nativeElement.classList.remove(`xd-${this._property}`);
    this._property = prop;
    if(this.active) {
      this.updateDragHandles()
    }
  }
  private handleRefs: ComponentRef<XdHandleComponent>[] = [];
  @HostBinding('class.active') active!: boolean;
  destroy$: Subject<void> = new Subject<void>();
  @ViewChild('contextMenuTemplate', { read: TemplateRef, static: false })
  contextMenuTemplate!: TemplateRef<any>;
  @ViewChild('handleContainer', { read: ViewContainerRef }) handleContainer!: ViewContainerRef;
  @ViewChild('elementContainer', { read: ViewContainerRef }) elementContainer!: ViewContainerRef;

  constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected state: StateService
  ) { }

  @HostListener('contextmenu', ['$event'])
  openMenu(e: MouseEvent){
    e.preventDefault();
    this.state.contextViewContainer.clear();
    e.stopPropagation();
    const [x, y] = eventPosition(e);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(XdMenuComponent);
    const ref = this.state.contextViewContainer.createComponent<XdMenuComponent>(componentFactory);
    ref.instance.template = this.contextMenuTemplate;
    ref.location.nativeElement.style.left = x + 'px';
    ref.location.nativeElement.style.top = y + 'px';
    ref.location.nativeElement.classList.add('visible');
  }

  ngOnInit(): void {
    this.state.activeItem.pipe(
      distinctUntilChanged(),
      tap((activeTab) => {
        this.active = activeTab == 'element-'+this.xdId;
        if(this.active){
          this.createDragHandles();
          this.state.activeViewContainer = this.elementContainer;
        }else{
          this.removeDragHandles();
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  createDragHandles(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(XdHandleComponent);
    const lRef = this.handleContainer.createComponent<XdHandleComponent>(componentFactory);
    const rRef = this.handleContainer.createComponent<XdHandleComponent>(componentFactory);
    const tRef = this.handleContainer.createComponent<XdHandleComponent>(componentFactory);
    const bRef = this.handleContainer.createComponent<XdHandleComponent>(componentFactory);

    this.renderer.addClass(lRef.location.nativeElement, 'l-knob');
    this.renderer.addClass(rRef.location.nativeElement, 'r-knob');
    this.renderer.addClass(tRef.location.nativeElement, 't-knob');
    this.renderer.addClass(bRef.location.nativeElement, 'b-knob');

    this.handleRefs = [lRef, rRef, tRef, bRef];
    tRef.instance.axis = 'y';
    bRef.instance.axis = '-y';
    lRef.instance.axis = 'x';
    rRef.instance.axis = '-x'
    this.updateDragHandles();
  }
  updateDragHandles(){
    this.elementRef.nativeElement.classList.add(`xd-${this._property}`);
    this.handleRefs.forEach(ref => {
      ref.instance.property = this._property;
    });
  }
  rePositionHandles(){
    this.handleRefs.forEach(ref => {
      ref.instance.reInitHandles = true;
    })
  }
  removeDragHandles(){
    this.elementRef.nativeElement.classList.remove(`xd-${this._property}`);
    this.handleRefs.forEach(ref => ref.destroy());
    this.handleRefs = [];
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
