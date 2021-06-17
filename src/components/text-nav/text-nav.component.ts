import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ElementModel, TextModel} from "../../models/art-board.model";
import {NgForm} from "@angular/forms";
import {combineLatest, Subject} from "rxjs";
import {StateService} from "../../services/state.service";
import {takeUntil, tap, withLatestFrom} from "rxjs/operators";
import {FontFamilyService} from "../../services/font-family.service";

@Component({
  selector: 'app-text-nav',
  templateUrl: './text-nav.component.html',
  styleUrls: ['./text-nav.component.scss']
})
export class TextNavComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() textId: string = 'text-1';
  initValue: TextModel = {
    textAlign: "",
    color: "",
    lineHeight: "",
    letterSpacing: "",
    fontSize: "",
    fontWeight: "",
    fontFamily: "",
    textTransform: "",
  }
  element!: TextModel | any;
  transformTab: string = '';
  @ViewChild('textForm', { static: false }) textForm!: NgForm;
  destroy$: Subject<void> = new Subject<void>();
  fontList: string[] = [];
  constructor(private state: StateService, private fontService: FontFamilyService) { }

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
    this.fontService.fontFamilyList.pipe(
      tap((fonts) => {
        this.fontList = [...Object.keys(fonts), 'Times','sans-serif','monospace'];
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
  setStyle(prop: {[prop: string]: string}, key?: string){
    if(key && this.element[key] === prop[key]){
      this.element[key] = '';
    }else{
      this.element = {...this.element, ...prop};
    }
    this.state.updateStyleData(this.textId, this.element);
  }
  onCardClick(card: string){
    if(this.transformTab != card){
      this.transformTab = card;
      this.state.activeUtility.next(this.transformTab);
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
