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
import {textNode, XDType} from "../../models/art-board.model";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss']
})
export class TextElementComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() type: string = XDType.Text;
  @HostBinding('class.editable')
  @HostBinding('attr.contenteditable') edit = false;
  @Input() textNodes: Array<string | textNode> = ["Lorem Ipsum"];
  selectedText!: any;
  constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected state: StateService,
    protected imageService: ImageService
  ) {
    super(elementRef,renderer,componentFactoryResolver, state, imageService);
  }

  @HostListener('dblclick', ['$event'])
  editTextContent(e: PointerEvent){
    e.preventDefault();
    e.stopPropagation();
    this.edit = true;
  }
  @HostListener('keydown', ['$event'])
  onChangeEvent(e: KeyboardEvent){
    if(this.edit && e.key == "Backspace"){
      e.preventDefault();
      e.stopPropagation();
      this.inputManipulation();
    }
  }
  @HostListener('blur', ['$event'])
  onBlur(e: Event){
    e.preventDefault();
    e.stopPropagation();
    this.selectedText = fetchSelection();
    const target: any = e.target;
    const txt = this.getTextNodes(target.childNodes);
    setTimeout(() => {
      this.textNodes = [];
      this.removeTextNodes(target);
      setTimeout(() => {
        this.textNodes = txt;
        this.state.updateStyleData(this.type + "-" + this.xdId, {textNodes: this.textNodes});
      });
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  breakTextNode(): void{
    if(this.selectedText){
      const i = this.textNodes.findIndex((node) => node === this.selectedText.nodeValue);
      this.textNodes.splice(i, 1);
      this.textNodes.splice(i, 0, this.selectedText.startText, {
        id: randomId(6),
        textNodes: [this.selectedText.selectedText]
      }, this.selectedText.endText);
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
        }else if(node.nodeName == "BR"){
          textNodes.push("\n");
        }
      });
    }
    return textNodes;
  }

  onStyleData(){
    super.onStyleData();
    if(this.elementData.textNodes){
      this.textNodes = this.elementData.textNodes;
    }
  }
  ngOnDestroy(): void{
    super.ngOnDestroy();
  }
  getNodeType(node: string | textNode): boolean{
    return typeof node !== "string";
  }
  inputManipulation(){
    const sel: Selection | null = document.getSelection();
    if(sel){
      if(sel.isCollapsed){
        const node: Node | null = sel.anchorNode;
        if(node && node.nodeName == "#text" && node.nodeValue){
          const offset = sel.anchorOffset;
          const textValue = node.nodeValue.slice(0, sel.anchorOffset-1) + node.nodeValue.slice(sel.anchorOffset);
          node.nodeValue = textValue ? textValue: " ";
          this.resetCaretPosition(sel,offset);
        }
      }
    }
  }
  resetCaretPosition(sel: Selection, offset: number){
    const range = document.createRange();
    if(sel.anchorNode){
      range.setStart(sel.anchorNode, offset > 1 ?offset + -1:offset);
    }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  removeTextNodes(parent: any){
    const nodes: NodeList = parent.childNodes;
    if(nodes && nodes.length > 0){
      for(let i=0;i<nodes.length;i++){
        if(nodes[i].nodeName == "#text"){
          this.renderer.removeChild(parent, nodes[i], true);
          i--;
        }
      }
    }
    const children = parent.children;
    if(children && children.length > 0){
      for(let i=0;i<children.length;i++){
        if(children[i].nodeName == "BR"){
          this.renderer.removeChild(parent, children[i], true);
          i--;
        }
      }
    }
  }
}
