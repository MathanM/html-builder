import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StateService} from "../services/state.service";
import {Subject} from "rxjs";
import {takeUntil, tap, withLatestFrom} from "rxjs/operators";
import {ArtBoardModel, FileUploadEvent} from "../models/art-board.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  activeTab: string = '';
  destroy$: Subject<void> = new Subject<void>();
  artBoard: ArtBoardModel = {
    width: "1440px",
    background: '#fff',
    zoom: 0.833,
    designHelper: null
  }
  @ViewChild('artBoardForm', { static: false }) artBoardForm!: NgForm;
  constructor(private state: StateService) {}

  ngOnInit(): void {
    this.state.activeItem.pipe(
      tap((activeTab) => {
        this.activeTab = activeTab;
        this.onTabChange();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  onTabChange(){
    setTimeout(()=>{
      if(this.artBoardForm){
        this.artBoardForm.form.valueChanges.pipe(
          withLatestFrom(this.state.styleData)
        ).subscribe(([val, styleData]) => {
          setTimeout(()=> {
            this.state.styleData.next({...styleData, artBoard: this.artBoard});
          })
        });
      }
    });
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
      this.artBoard.zoom = (appHome[0].clientWidth - 80) / width;
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
