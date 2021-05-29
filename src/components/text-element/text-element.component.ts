import {
  Component,
  ComponentFactoryResolver, ComponentRef,
  ElementRef, HostBinding,
  HostListener, Input,
  OnDestroy,
  OnInit,
  Renderer2, ViewChild, ViewContainerRef
} from '@angular/core';
import {StateService} from "../../services/state.service";
import {ElementComponent} from "../element/element.component";
import {distinctUntilChanged, takeUntil, tap} from "rxjs/operators";
import {fetchSelection, randomId} from "../../models/constant";

@Component({
  selector: 'text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss']
})
export class TextElementComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() type='text';
  @Input() textContent = 'Lorem Ipsum'
  @ViewChild('inlineContainer', { read: ViewContainerRef }) inlineContainer!: ViewContainerRef;
  @HostBinding('class.editable')
  @HostBinding('attr.contenteditable') edit = false;

  constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected state: StateService
  ) {
    super(elementRef,renderer,componentFactoryResolver, state);
  }

  @HostListener('dblclick', ['$event'])
  editTextContent(e: PointerEvent){
    e.preventDefault();
    e.stopPropagation();
    this.edit = true;
  }

  @HostListener('input', ['$event'])
  onEdit(e: Event){
    console.log(e);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.state.activeItem.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.edit = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  convertToNode(): void{
    const selection: any = fetchSelection();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TextElementComponent);
    const xdId = randomId(6);
    let componentRef: ComponentRef<TextElementComponent>;
    componentRef = this.inlineContainer.createComponent<TextElementComponent>(componentFactory);
    componentRef.instance.xdId = xdId;
    componentRef.instance.textContent = selection.selectedText;
    componentRef.instance.type = 'inline-text';
    this.renderer.addClass(componentRef.location.nativeElement, 'inline');
    this.renderer.removeChild(this.elementRef.nativeElement,selection.textNode);
    this.renderer.appendChild(this.elementRef.nativeElement, selection.startNode);
    this.renderer.appendChild(this.elementRef.nativeElement, componentRef.location.nativeElement);
    this.renderer.appendChild(this.elementRef.nativeElement, selection.endNode);
  }
  ngOnDestroy(): void{
    super.ngOnDestroy();
  }
}
