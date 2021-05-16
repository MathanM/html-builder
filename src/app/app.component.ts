import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StateService} from "../services/state.service";
import {Subject} from "rxjs";
import {takeUntil, tap, withLatestFrom} from "rxjs/operators";
import {ArtBoardModel} from "../models/art-board.model";
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
    zoom: 0.835,
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
          this.state.styleData.next({...styleData, artBoard: this.artBoard});
        });
      }
    });
  }
  onApplyColor(color: string){
    console.log(color);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
