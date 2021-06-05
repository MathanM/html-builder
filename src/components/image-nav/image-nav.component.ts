import { Component, OnInit } from '@angular/core';
import {ImageService} from "../../services/image.service";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-image-nav',
  templateUrl: './image-nav.component.html',
  styleUrls: ['./image-nav.component.scss']
})
export class ImageNavComponent implements OnInit {
  imgList: any = {};
  destroy$: Subject<void> = new Subject<void>();
  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    this.imageService.imageList.pipe(
      tap((images) => {
        this.imgList = images;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  getImagesName(){
    return Object.keys(this.imgList);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
