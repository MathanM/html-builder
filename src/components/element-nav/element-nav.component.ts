import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ElementModel} from "../../models/art-board.model";
import {NgForm} from "@angular/forms";
import {combineLatest, Subject} from "rxjs";
import {StateService} from "../../services/state.service";
import {takeUntil, tap, withLatestFrom} from "rxjs/operators";

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
    paddingLeft: "0px",
    paddingRight: "0px",
    paddingTop: "0px",
    paddingBottom: "0px"
  }
  element!: ElementModel;
  transformTab: string = 'Size';
  @ViewChild('elementForm', { static: false }) elementForm!: NgForm;
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
        setTimeout(()=> {
          this.state.styleData.next({...styleData, [this.elementId]: this.element});
        })
      });
    }
  }
  onTabChange(){
    this.state.activeUtility.next(this.transformTab);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
