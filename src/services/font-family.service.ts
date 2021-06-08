import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";
import {fontFormats, getFontFamilyProps} from "../models/constant";
import {DOCUMENT} from "@angular/common";
declare let FontFace: any;

@Injectable({
  providedIn: 'root'
})
export class FontFamilyService {
  fontFamilyList: BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor(private domSanitizer: DomSanitizer, @Inject(DOCUMENT) private document: Document) { }
  async getFonts(fontHandle: any){
   const fonts = await this.getFontLinks(fontHandle);
   this.fontFamilyList.next(fonts);
   this.loadFonts();
  }
  async getFontLinks(fontHandle: any, family: string = ''){
    const fonts: any = {}
    const fontList = await fontHandle.entries();
    let fontFile = await fontList.next();
    while (!fontFile.done) {
      const handle = await fontFile.value[1];
      if(handle.kind != 'directory'){
        const file = await handle.getFile();
        if (
          file.type != "text/plain" &&
          fontFormats.findIndex((format) => file.name.indexOf(format) != -1) != -1
        ) {
          const {italic, weight} = getFontFamilyProps(file.name)
          fonts[file.name] = {
            url: this.getFontUrl(file, false),
            name: file.name,
            fontStyle: italic?'italic':'normal',
            fontWeight: weight,
            fontFamily: family
          };
        }
      }else{
        fonts[handle.name] = await this.getFontLinks(handle, handle.name);
      }
      fontFile = await fontList.next();
    }
    return fonts;
  }
  getFontUrl(file: File, sanitize: boolean = true){
    const blob = new Blob([file],{type: file.type});
    const url = URL.createObjectURL(blob)
    if(sanitize){
      return this.domSanitizer.bypassSecurityTrustUrl(url);
    }else{
      return url;
    }
  }
  loadFonts(){
    const css = this.getFontFamilyRules();
    const head = document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }
  getFontFamilyRules(){
    const fontList = this.fontFamilyList.getValue();
    let fontStyleSheet = '';
    const fontFamily = Object.keys(fontList);
    fontFamily.forEach(family => {
      const fontFiles = Object.keys(fontList[family]);
      fontFiles.forEach((file) => {
        fontStyleSheet += `
        @font-face {
          font-family: '${family}';
          src: url(${fontList[family][file].url}) format('truetype');
          font-style: ${fontList[family][file].fontStyle};
          font-weight: ${fontList[family][file].fontWeight}
        }
      `
      })
    });
    return fontStyleSheet;
  }
  // Javascript way of adding font face
  /*getFontFace(){
    const fontList = this.fontFamilyList.getValue();
    const fontFamily = Object.keys(fontList);
    fontFamily.forEach(family => {
      const fontFiles = Object.keys(fontList[family]);
      fontFiles.forEach(async(file) => {
        const font = new FontFace(family, `url(${fontList[family][file].url})`, {
          weight: fontList[family][file].fontWeight,
          style: fontList[family][file].fontStyle
        });
        await font.load();
        (document as any).fonts.add(font);
      })
    });
  }*/
}
