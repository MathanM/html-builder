import {
  AfterViewInit,
  Component, ComponentFactoryResolver,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {StateService} from "../../services/state.service";
import {distinctUntilChanged, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {ArtBoardModel, XDType} from "../../models/art-board.model";
import {isEmpty, isEqual} from "lodash";
import {eventPosition} from "../../models/constant";
import {XdMenuComponent} from "../xd-menu/xd-menu.component";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-art-board',
  templateUrl: './art-board.component.html',
  styleUrls: ['./art-board.component.scss']
})
export class ArtBoardComponent implements OnInit,AfterViewInit, OnDestroy {
  active = false;
  destroy$: Subject<void> = new Subject<void>();
  artBoard!: ArtBoardModel;
  designHelper = false;
  @ViewChild('elementContainer', { read: ViewContainerRef }) elementContainer!: ViewContainerRef;
  @ViewChild('contextMenuTemplate', { read: TemplateRef, static: false })
  contextMenuTemplate!: TemplateRef<any>;
  isPasteEnable: boolean = false;
  designHelperUrl: string = '';
  constructor(private state: StateService, private componentFactoryResolver: ComponentFactoryResolver,private imageService: ImageService) {}

  ngOnInit(): void {
    this.state.activeItem.pipe(
      distinctUntilChanged(),
      tap((activeTab) => {
        this.active = activeTab == XDType.ArtBoard;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.state.styleData.pipe(
      tap((data:any) => {
          this.artBoard = data.artBoard;
          this.checkDesignHelper();
      })
    ).subscribe();
    this.state.copyId.pipe(
      tap((copy) => {
        this.isPasteEnable = !copy.id
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }
  ngAfterViewInit() {
    this.state.artBoardViewContainer = this.elementContainer;
  }

  @HostListener('mousedown', ['$event'])
  onArtBoardClick(e: MouseEvent): void {
    e.stopPropagation();
    this.state.activeItem.next('artboard');
  }

  @HostListener('contextmenu', ['$event'])
  openMenu(e: MouseEvent){
    e.preventDefault();
    this.state.contextViewContainer.clear();
    e.stopPropagation();
    const [x, y] = eventPosition(e);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(XdMenuComponent);
    const ref = this.state.contextViewContainer.createComponent<XdMenuComponent>(componentFactory);
    ref.instance.template = this.contextMenuTemplate;
    ref.location.nativeElement.style.left = x + 'px';
    ref.location.nativeElement.style.top = y + 'px';
    ref.location.nativeElement.classList.add('visible');
  }

  async checkDesignHelper(){
    if(this.artBoard && !isEmpty(this.artBoard.designHelper)){
      this.designHelper = true;
      const root: any = document.querySelector(':root');
      if (root) {
        root.style.setProperty('--design-helper-width', this.artBoard.designHelper.width);
        root.style.setProperty('--design-helper-height', this.artBoard.designHelper.height);
        root.style.setProperty('--design-helper-offset', this.artBoard.designHelper.top);
        if(this.designHelperUrl != this.artBoard.designHelper.url){
          this.artBoard.designHelper.url = await this.getHelperImageUrl();
          root.style.setProperty('--design-helper-url', `url(${this.artBoard.designHelper.url})`);
          this.designHelperUrl = this.artBoard.designHelper.url
        }
        root.style.setProperty('--design-helper-opacity', this.artBoard.designHelper.toggle?0.5:0);
      }
    }else{
      this.designHelper = false;
    }
  }
  async getHelperImageUrl(){
    const helperHandle = await this.state.projectDirHandle.getDirectoryHandle('design-helper',{ create: true });
    const fileHandle = await helperHandle.getFileHandle(this.artBoard.designHelper.name);
    const file = await fileHandle.getFile();
    return this.imageService.getImgUrl(file, false);
  }
  pasteElement(){
    this.state.pasteElement();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
