import {Component, ElementRef, HostListener, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'xd-menu',
  templateUrl: './xd-menu.component.html',
  styleUrls: ['./xd-menu.component.scss']
})
export class XdMenuComponent {
  @Input() template!: TemplateRef<any>;
  @HostListener('document:click', ['$event'])
  closeMenu(e: PointerEvent){
    e.preventDefault();
    e.stopPropagation();
    this.elementRef.nativeElement.remove();
  }
  constructor(private elementRef: ElementRef) { }
}
