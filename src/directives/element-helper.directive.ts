import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef, HostBinding,
  HostListener,
  Input, OnDestroy, OnInit,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import {XdHandleComponent} from "../components/xd-handle/xd-handle.component";
import {StateService} from "../services/state.service";
import {takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";

@Directive({
  selector: '[elementHelper]',
})
export class ElementHelperDirective implements OnInit, OnDestroy {
  @Input() xdId!: string;
  @Input() property: string = 'size';
  private handleRefs: ComponentRef<XdHandleComponent>[] = [];
  @HostBinding('class.active') active!: boolean;
  destroy$: Subject<void> = new Subject<void>();
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private state: StateService
  ) { }

  ngOnInit(): void {
    this.state.activeItem.pipe(
      tap((activeTab) => {
        this.active = activeTab == 'element-'+this.xdId;
        if(this.active){
          this.createDragHandles();
        }else{
          this.removeDragHandles();
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  createDragHandles(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(XdHandleComponent);
    const lRef = this.viewContainerRef.createComponent<XdHandleComponent>(componentFactory);
    const rRef = this.viewContainerRef.createComponent<XdHandleComponent>(componentFactory);
    const tRef = this.viewContainerRef.createComponent<XdHandleComponent>(componentFactory);
    const bRef = this.viewContainerRef.createComponent<XdHandleComponent>(componentFactory);
    this.renderer.appendChild(this.elementRef.nativeElement, lRef.location.nativeElement);
    this.renderer.appendChild(this.elementRef.nativeElement, rRef.location.nativeElement);
    this.renderer.appendChild(this.elementRef.nativeElement, tRef.location.nativeElement);
    this.renderer.appendChild(this.elementRef.nativeElement, bRef.location.nativeElement);
    this.renderer.addClass(lRef.location.nativeElement, 'l-knob');
    this.renderer.addClass(rRef.location.nativeElement, 'r-knob');
    this.renderer.addClass(tRef.location.nativeElement, 't-knob');
    this.renderer.addClass(bRef.location.nativeElement, 'b-knob');
    this.handleRefs = [lRef, rRef, tRef, bRef];
    tRef.instance.axis = 'y'
    bRef.instance.axis = 'y'
  }
  removeDragHandles(){
    this.handleRefs.forEach(ref => ref.destroy());
    this.handleRefs = [];
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
