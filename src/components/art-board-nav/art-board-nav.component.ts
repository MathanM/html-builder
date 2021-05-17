import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ArtBoardModel, FileUploadEvent} from "../../models/art-board.model";
import {NgForm} from "@angular/forms";
import {StateService} from "../../services/state.service";
import {take, takeUntil, tap, withLatestFrom} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-art-board-nav',
  templateUrl: './art-board-nav.component.html',
  styleUrls: ['./art-board-nav.component.scss']
})
export class ArtBoardNavComponent implements AfterViewInit, OnDestroy {
  artBoard: ArtBoardModel = {
    width: "1440px",
    background: '#fff',
    zoom: 0.833,
    designHelper: null
  }
  @ViewChild('artBoardForm', { static: false }) artBoardForm!: NgForm;
  destroy$: Subject<void> = new Subject<void>();
  constructor(private state: StateService) { }

  ngAfterViewInit(): void{
    this.initFormChange();
  }
  initFormChange(){
    if(this.artBoardForm){
      this.artBoardForm.form.valueChanges.pipe(
        withLatestFrom(this.state.styleData),
        takeUntil(this.destroy$)
      ).subscribe(([val, styleData]) => {
        setTimeout(()=> {
          this.state.styleData.next({...styleData, artBoard: this.artBoard});
        })
      });
    }
  }
  onDesignHelperUpload(e: FileUploadEvent){
    this.artBoard.width = e.width;
    this.artBoard.height = e.height;
    this.calcArtBoardZoom(parseFloat(e.width || ''));
    this.artBoard.designHelper = {...e, top: "0px", toggle: true};
    const styleData = this.state.styleData.getValue();
    this.state.styleData.next({...styleData, artBoard: this.artBoard});
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
