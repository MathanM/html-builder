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
export interface FileUploadEvent {
  name: string;
  width?: string;
  height?: string;
  url: string;
}
