export type ArtBoardModel = {
  width?: string;
  height?: string;
  background: string;
  zoom: number;
  designHelper: any;
  fonts: {
    [key: string]: FontFamilyModel[];
  }
}
export type FontFamilyModel = {
  name: string;
  fontWeight: number;
  fontStyle: string;
  fontFamily: string;
}
export type ImageModel = {
  width?: string;
  height?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  backgroundColor?: string;
  borderRadius?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  src?: string;
  alt?: string;
}
export type TextModel = {
  textAlign?: string;
  color?: string;
  lineHeight?: string;
  fontSize?: string;
  fontFamily?: string;
  textTransform?: string;
  width?: string;
  height?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  textDecoration?: string;
  fontStyle?: string;
  fontWeight?: string;
  textNodes?: Array<string | textNode>;
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
  elementId: string;
  selected?: boolean;
  label: string;
  sortOrder: number;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  classList?: string[];
  id?: string;
  tag?: string;
  parent?: any;
}
export interface textNode {
  id: string;
  textNodes: Array<string | textNode>;
}
export interface FileUploadEvent {
  name: string;
  width?: string;
  height?: string;
  url: string;
  file: File
}

export enum XDType {
  Element = "element",
  Text = "text",
  InlineText = "inline-text",
  ArtBoard = "artboard",
  Image = "image"
}
export interface CopyId{
  id: string;
  layer: LayerModel | object;
}
