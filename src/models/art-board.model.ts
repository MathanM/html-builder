export type ArtBoardModel = {
  width?: string;
  height?: string;
  background: string;
  zoom: number;
  designHelper: any;
}
export type ElementModel = {
  width?: string;
  height?: string;
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
  borderRadius?: string;
}
export interface LayerModel {
  expanded?: boolean;
  children?: LayerModel[] | null;
  parentId?: string | null;
  elementId: string;
  selected?: boolean;
  name: string;
  sortOrder: number;
  icon?: string;
}
export interface FileUploadEvent {
  name: string;
  width?: string;
  height?: string;
  url: string;
}
