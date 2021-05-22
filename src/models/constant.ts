import {LayerModel} from "./art-board.model";

export const initArtBoard: LayerModel = {
  expanded: true,
  sortOrder: 1,
  parentId: null,
  elementId: 'artboard',
  label: 'body',
  icon: "pi pi-inbox",
  allChildren: [],
  children: []
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
