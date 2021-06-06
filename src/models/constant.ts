import {LayerModel, XDType} from "./art-board.model";
import {ElementComponent} from "../components/element/element.component";
import {TextElementComponent} from "../components/text-element/text-element.component";
import {ImageElementComponent} from "../components/image-element/image-element.component";

export const initArtBoard: LayerModel = {
  expanded: true,
  sortOrder: 1,
  elementId: 'artboard',
  label: 'body',
  icon: "pi pi-inbox",
  allChildren: [],
  children: [],
  tag: 'body'
}
export const XDComponent: any = {
  element: {
    component: ElementComponent,
    expandIcon: "pi pi-folder-open",
    collapseIcon: "pi pi-folder",
    tag: "div"
  },
  text: {
    component: TextElementComponent,
    expandIcon: "xd xd-text",
    collapseIcon: "xd xd-text",
    tag: "p"
  },
  image: {
    component: ImageElementComponent,
    expandIcon: "pi pi-image",
    collapseIcon: "pi pi-image",
    tag: "img"
  }
}
export function eventPosition(e: TouchEvent | MouseEvent) {
  if (e instanceof TouchEvent) {
    return [e.touches[0].clientX, e.touches[0].clientY];
  } else {
    return [e.clientX, e.clientY];
  }
}
export const normalizePosition = (mouseX: number, mouseY: number, scope: HTMLElement, contextMenu: HTMLElement) => {
  const {
    left: scopeOffsetX,
    top: scopeOffsetY,
  } = scope.getBoundingClientRect();

  const scopeX = mouseX - scopeOffsetX;
  const scopeY = mouseY - scopeOffsetY;

  // ? check if the element will go out of bounds
  const outOfBoundsOnX =
    scopeX + contextMenu.clientWidth > scope.clientWidth;

  const outOfBoundsOnY =
    scopeY + contextMenu.clientHeight > scope.clientHeight;

  let normalizedX = mouseX;
  let normalizedY = mouseY;

  if (outOfBoundsOnX) {
    normalizedX =
      scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
  }

  if (outOfBoundsOnY) {
    normalizedY =
      scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
  }

  return { normalizedX, normalizedY };
};
const camel2KebabCase = (value: string) => {
  const reg = new RegExp('/[A-Z]/', 'g');
  return value.replace(reg, (str) => `-${str.toLowerCase()}`);
}
export const object2css = (cssObject: any) => {
  const props = Object.keys(cssObject).map(property => `${camel2KebabCase(property)}: ${cssObject[property]};`);
  return props.join("\n");
}
export const fetchSelection = (): any => {
  const e = document.getSelection();
  if(e && e.type === "Range"){
    const startIndex = e.anchorOffset;
    const endIndex = e.anchorNode === e.focusNode ? e.focusOffset: (e.anchorNode?.nodeValue?.length || 0);
    const textNode = e.anchorNode;
    const selectedText = textNode?.nodeValue?.substring(startIndex, endIndex);
    const textNodes = textNode?.nodeValue?.split(selectedText || "");
    if(textNodes){
      return {startText: textNodes[0], endText: textNodes[1], selectedText, textNode}
    }
  }
}
export const randomId = (length: number, type?: string): string => {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return type?`${type}-${result}`:result;
}

export const isType = (id: string, type: string): boolean => {
  return id.indexOf(type) != -1;
}
export const getType = (id: string): string => {
  if(id.indexOf(XDType.Element) != -1){
    return XDType.Element
  }else if(id.indexOf(XDType.InlineText) != -1){
    return XDType.InlineText
  }else if(id.indexOf(XDType.Text) != -1){
    return XDType.Text
  }else if(id.indexOf(XDType.Image) != -1){
    return XDType.Image
  }
  return ''
}
