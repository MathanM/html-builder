import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ArtBoardModel, FileUploadEvent} from "../../models/art-board.model";
import {NgForm} from "@angular/forms";
import {StateService} from "../../services/state.service";
import {take, takeUntil, withLatestFrom} from "rxjs/operators";
import {Subject} from "rxjs";
import {FontFamilyService} from "../../services/font-family.service";

@Component({
  selector: 'app-art-board-nav',
  templateUrl: './art-board-nav.component.html',
  styleUrls: ['./art-board-nav.component.scss']
})
export class ArtBoardNavComponent implements OnInit, AfterViewInit, OnDestroy {
  artBoard!: ArtBoardModel;
  @ViewChild('artBoardForm', { static: false }) artBoardForm!: NgForm;
  destroy$: Subject<void> = new Subject<void>();
  fontOpen: boolean = false;
  fontList: any;
  constructor(private state: StateService, private fontService: FontFamilyService) {}
  ngOnInit() : void{
    this.state.styleData.pipe(
      take(1)
    ).subscribe((styleData: any) => {
      // this.artBoard = {...styleData.artBoard};
      this.artBoard = styleData.artBoard;
      this.on2x();
    });
    this.fontService.fontFamilyList.pipe(
      takeUntil(this.destroy$)
    ).subscribe((fonts) => {
      this.fontList = fonts;
    });
  }

  ngAfterViewInit(): void{
    this.initFormChange();
  }
  initFormChange(){
    if(this.artBoardForm){
      this.artBoardForm.form.valueChanges.pipe(
        withLatestFrom(this.state.styleData),
        takeUntil(this.destroy$)
      ).subscribe(([val, styleData]) => {
          if(!this.artBoard.backgroundToggle){
            this.artBoard.backgroundColor = "";
          }
          this.state.styleData.next({...styleData, artBoard: this.artBoard});
      });
    }
  }
  onBackground(flag: boolean): void{
    if(!flag){
      this.artBoard.backgroundColor = "";
    }
  }
  onColor(flag: boolean): void{
    if(!flag){
      this.artBoard.color = "";
    }
  }
  onDesignHelperUpload(e: FileUploadEvent){
    this.artBoard.width = e.width;
    this.artBoard.height = e.height;
    this.calcArtBoardZoom(parseFloat(e.width || ''));
    this.artBoard.designHelper = {...e, originalWidth: e.width, originalHeight: e.height, top: "0px", toggle: true};
    this.state.updateStyleData('artBoard', this.artBoard);
    this.createDesignImage(e.file);
  }
  on2x(){
    if(this.artBoard.designHelper){
      if(this.artBoard.designHelper.is2x){
        this.artBoard.designHelper.width = (parseFloat(this.artBoard.designHelper.originalWidth) / 2) + "px";
        this.artBoard.designHelper.height = (parseFloat(this.artBoard.designHelper.originalHeight) / 2) + "px";
      }else{
        this.artBoard.designHelper.width = this.artBoard.designHelper.originalWidth;
        this.artBoard.designHelper.height = this.artBoard.designHelper.originalHeight;
      }
      this.artBoard.width = this.artBoard.designHelper.width;
      this.artBoard.height = this.artBoard.designHelper.height;
      this.calcArtBoardZoom(parseFloat(this.artBoard.width || ''));
      this.state.updateStyleData('artBoard', this.artBoard);
    }
  }
  async createDesignImage(file: File){
    if(this.state.projectDirHandle){
      const helperHandle = await this.state.projectDirHandle.getDirectoryHandle('design-helper',{ create: true });
      const fileHandle = await helperHandle.getFileHandle(file.name, { create: true });
      const blob = new Blob([file],{type: file.type});
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
    }
  }
  calcArtBoardZoom(width: number){
    const appHome = document.getElementsByTagName('app-home');
    if(appHome && width){
      const zoom = (appHome[0].clientWidth - 80) / width;
      this.artBoard.zoom = Math.round((zoom + Number.EPSILON) * 1000) / 1000;
    }
  }
  onArtBoardWidthChange(){
    this.calcArtBoardZoom(parseFloat(this.artBoard.width || ''));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
