import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ElementModel, TextModel} from "../../models/art-board.model";
import {NgForm} from "@angular/forms";
import {combineLatest, Subject} from "rxjs";
import {StateService} from "../../services/state.service";
import {takeUntil, tap, withLatestFrom} from "rxjs/operators";

@Component({
  selector: 'app-text-nav',
  templateUrl: './text-nav.component.html',
  styleUrls: ['./text-nav.component.scss']
})
export class TextNavComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() textId: string = 'text-1';
  initValue: TextModel = {
    textAlign: "left",
    color: "#000",
    lineHeight: "",
    fontSize: "",
    fontFamily: "",
    textTransform: "",
  }
  element!: TextModel;
  transformTab: string = '';
  @ViewChild('textForm', { static: false }) textForm!: NgForm;
  destroy$: Subject<void> = new Subject<void>();
  constructor(private state: StateService) { }

  ngOnInit(): void {
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
    if(this.textForm){
      this.textForm.form.valueChanges.pipe(
        withLatestFrom(this.state.styleData),
        takeUntil(this.destroy$)
      ).subscribe(([val, styleData]) => {
        setTimeout(()=> {
          this.state.styleData.next({...styleData, [this.textId]: this.element});
        })
      });
    }
  }
  setStyle(prop: {[prop: string]: string}){
    this.element = {...this.element, ...prop};
    this.state.updateStyleData(this.textId, this.element);
  }
  onTabChange(){
    this.state.activeUtility.next(this.transformTab);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}