import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {StateService} from "../../services/state.service";
import {ElementComponent} from "../element/element.component";
import {fetchSelection, randomId} from "../../models/constant";
import {textNode} from "../../models/art-board.model";

@Component({
  selector: 'text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss']
})
export class TextElementComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() type='text';
  @HostBinding('class.editable')
  @HostBinding('attr.contenteditable') edit = false;
  @Input() textNodes: Array<string | textNode> = ["Lorem Ipsum"];
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

  @HostListener('blur', ['$event'])
  onBlur(e: Event){
    e.preventDefault();
    e.stopPropagation();
    const target: any = e.target;
    this.textNodes = this.getTextNodes(target.childNodes);
    this.state.updateStyleData(this.type+"-"+this.xdId, { textNodes: this.textNodes });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  breakTextNode(): void{
    const selection: any = fetchSelection();
    if(selection){
      const i = this.textNodes.findIndex((node) => node === selection.textNode.nodeValue);
      this.textNodes.splice(i, 1);
      this.textNodes.splice(i, 0, selection.startNode.nodeValue, {
        id: randomId(6),
        textNodes: [selection.selectedText]
      }, selection.endNode.nodeValue);
      this.state.updateStyleData(this.type + "-" + this.xdId, {textNodes: this.textNodes});
    }
  }
  breakTextDisabled(): boolean{
    const sel = document.getSelection();
    return !(sel?.type === "Range")
  }
  onActiveItem() {
    super.onActiveItem();
    this.edit = false;
  }
  getTextNodes(nodes: any[]){
    const textNodes: any[] = [];
    if(nodes && nodes.length > 0){
      nodes.forEach((node: any) => {
        if(node.nodeName == "#text"){
          textNodes.push(node.nodeValue);
        }else if(node.nodeName == "TEXT-ELEMENT"){
          const subNodes = this.getTextNodes(node.childNodes);
          textNodes.push({
            id: node.getAttribute('xd-id'),
            textNodes: subNodes
          });
        }
      });
    }
    return textNodes;
  }

  onStyleData(){
    super.onStyleData();
    if(this.elementData.text){
      this.textNodes = this.elementData.textNodes;
    }
  }
  ngOnDestroy(): void{
    super.ngOnDestroy();
  }
  getNodeType(node: string | textNode): boolean{
    return typeof node !== "string";
  }
}
