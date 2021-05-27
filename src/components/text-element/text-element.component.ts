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
import {ElementComponent} from "../element/element.component";

@Component({
  selector: 'text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss']
})
export class TextElementComponent extends ElementComponent implements OnInit, OnDestroy {
  type='text';
  textContent = 'Lorem Ipsum'
  edit = false;
  @HostListener('click', ['$event'])
  editTextContent(e: PointerEvent){
    this.edit = true;
  }
  constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected state: StateService
  ) {
    super(elementRef,renderer,componentFactoryResolver, state);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  ngOnDestroy(): void{
    super.ngOnDestroy();
  }
  onChange(e: Event){
    console.log(e);
  }
}
