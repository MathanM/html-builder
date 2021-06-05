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
      console.log(file);
      const blob = new Blob([file],{type: file.type});
      const url = URL.createObjectURL(blob)
      images[file.name] = this.domSanitizer.bypassSecurityTrustUrl(url);
      imgFile = await imgList.next();
    }
    this.imageList.next(images);
  }
}
