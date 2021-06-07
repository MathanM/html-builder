import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImageService} from "../../services/image.service";
import {combineLatest, Subject} from "rxjs";
import {takeUntil, tap, withLatestFrom} from "rxjs/operators";
import {ImageModel, TextModel} from "../../models/art-board.model";
import {NgForm} from "@angular/forms";
import {StateService} from "../../services/state.service";

@Component({
  selector: 'app-image-nav',
  templateUrl: './image-nav.component.html',
  styleUrls: ['./image-nav.component.scss']
})
export class ImageNavComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() imgId: string = 'image-1';
  initValue: ImageModel = {
    width: "",
    height: "",
    paddingLeft: "",
    paddingRight: "",
    paddingTop: "",
    paddingBottom: "",
    marginLeft: "",
    marginRight: "",
    marginTop: "",
    marginBottom: "",
    backgroundColor: "",
    src: "assets/images/placeholder.jpg",
    alt: "placeholder"
  }
  element!: ImageModel | any;
  transformTab: string = '';
  @ViewChild('imgForm', { static: false }) imgForm!: NgForm;
  imgList: any = {};
  destroy$: Subject<void> = new Subject<void>();
  imgPickerOpen: boolean = false;

  constructor(private state: StateService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.imageService.imageList.pipe(
      tap((images) => {
        this.imgList = images;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    combineLatest([
      this.state.activeItem,
      this.state.styleData
    ]).pipe(
      tap(([activeTab, styleData]) => {
        if(styleData[activeTab]){
          this.element = styleData[activeTab];
        }else{
          this.element = this.initValue;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  ngAfterViewInit(): void{
    this.initFormChange();
  }
  initFormChange(){
    if(this.imgForm){
      this.imgForm.form.valueChanges.pipe(
        withLatestFrom(this.state.styleData),
        takeUntil(this.destroy$)
      ).subscribe(([val, styleData]) => {
        setTimeout(()=> {
          this.state.styleData.next({...styleData, [this.imgId]: this.element});
        })
      });
    }
  }
  getImagesName(){
    return Object.keys(this.imgList);
  }
  onCardClick(card: string){
    if(this.transformTab != card){
      this.transformTab = card;
      this.state.activeUtility.next(this.transformTab);
    }
  }
  onImgClick(name: string){
    this.element.src = name;
    this.state.updateStyleData(this.imgId, this.element);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
