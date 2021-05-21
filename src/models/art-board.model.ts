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
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  display?: string;
  alignItems?: string;
  justifyContent?: string;
  flexDirection?: string;
  flexWrap?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
}
export interface LayerModel {
  expanded?: boolean;
  children?: LayerModel[] | null;
  allChildren?: string[] | null;
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
