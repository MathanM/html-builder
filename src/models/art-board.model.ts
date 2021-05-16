export type ArtBoardModel = {
  width?: string;
  height?: string;
  background: string;
  zoom: number;
  designHelper: any;
}
export interface FileUploadEvent {
  name: string;
  width?: string;
  height?: string;
  url: string;
}
