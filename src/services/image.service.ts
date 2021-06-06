import { Injectable } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageList: BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor(private domSanitizer: DomSanitizer) { }
  async getImageLinks(imageHandle: any){
    const images: any = {}
    const imgList = await imageHandle.entries();
    let imgFile = await imgList.next();
    while (!imgFile.done) {
      let file = await imgFile.value[1].getFile();
      images[file.name] = this.getImgUrl(file);
      imgFile = await imgList.next();
    }
    this.imageList.next(images);
  }
  getImgUrl(file: File, sanitize: boolean = true){
    const blob = new Blob([file],{type: file.type});
    const url = URL.createObjectURL(blob)
    if(sanitize){
      return this.domSanitizer.bypassSecurityTrustUrl(url);
    }else{
      return url;
    }

  }
}
