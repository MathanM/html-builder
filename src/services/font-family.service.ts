import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class FontFamilyService {
  fontFamilyList: BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor(private domSanitizer: DomSanitizer) { }
  async getFonts(fontHandle: any){
   const fonts = await this.getFontLinks(fontHandle);
   this.fontFamilyList.next(fonts);
  }
  async getFontLinks(fontHandle: any){
    const fonts: any = {}
    const fontList = await fontHandle.entries();
    let fontFile = await fontList.next();
    while (!fontFile.done) {
      const handle = await fontFile.value[1];
      if(handle.kind != 'directory'){
        const file = await handle.getFile();
        if(file.type != "text/plain"){
          fonts[file.name] = this.getFontUrl(file, false);
        }
      }else{
        fonts[handle.name] = await this.getFontLinks(handle);
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
}
