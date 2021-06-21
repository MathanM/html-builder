import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ElementModel} from "../../models/art-board.model";
import {NgForm} from "@angular/forms";
import {combineLatest, Subject} from "rxjs";
import {StateService} from "../../services/state.service";
import {takeUntil, tap, withLatestFrom} from "rxjs/operators";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-element-nav',
  templateUrl: './element-nav.component.html',
  styleUrls: ['./element-nav.component.scss']
})
export class ElementNavComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() elementId: string = 'element-1';
  initValue: ElementModel = {
    width: '100px',
    height: '100px',
    backgroundColor: '',
    borderColor: '',
    paddingLeft: "",
    paddingRight: "",
    paddingTop: "",
    paddingBottom: "",
    marginLeft: "",
    marginRight: "",
    marginTop: "",
    marginBottom: "",
    display: "",
    alignItems: "",
    justifyContent: "",
    flexDirection:"",
    flexWrap:"",
    minHeight:"",
    maxHeight:"",
    maxWidth:"",
    minWidth:"",
    borderStyle: "",
    borderWidth: "",
    borderToggle: false,
    backgroundToggle: false
  }
  element!: ElementModel;
  transformTab: string = 'Size';
  @ViewChild('elementForm', { static: false }) elementForm!: NgForm;
  destroy$: Subject<void> = new Subject<void>();
  imgPickerOpen: boolean = false;
  imgList: any = {};
  selector: string = "Element";
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
    this.transformTab = this.state.activeUtility.getValue();
  }
  ngAfterViewInit(): void{
    this.initFormChange();
  }
  initFormChange(){
    if(this.elementForm){
      this.elementForm.form.valueChanges.pipe(
        withLatestFrom(this.state.styleData),
        takeUntil(this.destroy$)
      ).subscribe(([val, styleData]) => {
          this.state.styleData.next({...styleData, [this.elementId]: this.element});
      });
    }
  }
  setStyle(prop: {[prop: string]: string}){
    this.element = {...this.element, ...prop};
    this.state.updateStyleData(this.elementId, this.element);
  }
  onCardClick(card: string){
    if(this.transformTab != card){
      this.transformTab = card;
      this.state.activeUtility.next(this.transformTab);
    }
  }
  onBorder(flag: boolean): void{
    if(flag){
      this.element.borderWidth = "1px";
      this.element.borderStyle = "solid";
    }else{
      this.element.borderWidth = "";
      this.element.borderStyle = "";
    }
  }
  onBackground(flag: boolean): void{
    if(!flag){
      this.element.backgroundColor = "";
      this.element.imageUrl = "";
      this.element.backgroundPosition = "";
      this.element.backgroundSize = "";
      this.element.backgroundRepeat = "";
      this.element.backgroundImage = "";
    }
  }
  getImagesName(){
    return Object.keys(this.imgList);
  }
  onImgClick(name: string){
    this.element.imageUrl = name;
    this.element.backgroundPosition = "top center";
    this.element.backgroundSize = "cover";
    this.element.backgroundRepeat = "no-repeat"
    this.state.updateStyleData(this.elementId, this.element);
  }
  extractCssRules(){
    const css: any = {};
    for(const prop in this.element){
      if(this.element[prop as keyof ElementModel]){
        css[prop] = this.element[prop as keyof ElementModel];
        // @ts-ignore
        this.element[prop as keyof ElementModel] = "";
      }
    }
    console.log(css);
    this.state.updateStyleData(this.elementId, this.element);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
