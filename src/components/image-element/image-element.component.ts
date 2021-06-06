import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {ElementComponent} from "../element/element.component";
import {StateService} from "../../services/state.service";
import {XDType} from "../../models/art-board.model";

@Component({
  selector: 'img-element',
  templateUrl: './image-element.component.html',
  styleUrls: ['./image-element.component.scss']
})
export class ImageElementComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() type: string = XDType.Image;

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
}
