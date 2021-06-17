import {Component, OnInit} from '@angular/core';
import {StateService} from "../../services/state.service";
import {combineLatest} from "rxjs";
import {take, tap} from "rxjs/operators";
import {XDType} from "../../models/art-board.model";
import {ImageService} from "../../services/image.service";
import {FontFamilyService} from "../../services/font-family.service";

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  newProjectOpen: boolean = false;
  projectDir: string = '';
  projectName: string = '';
  directory: any;
  constructor(private state: StateService, private imageService: ImageService, private fontService: FontFamilyService) { }

  ngOnInit(): void {
  }
  async newProject(){
    this.directory = await (window as any).showDirectoryPicker();
    this.projectDir = '/'+this.directory.name;
  }
  onSave(){
    combineLatest([
      this.state.styleData,
      this.state.layersData
    ]).pipe(
      take(1),
      tap(async([styleData, layerData]) => {
        const out = { styleData, layerData };
        const jsonString = JSON.stringify(out, this.replacer, 2);
        const metaHandle = await this.state.projectDirHandle.getFileHandle('meta.json');
        const writable = await metaHandle.createWritable();
        await writable.write(jsonString);
        await writable.close();
      })
    ).subscribe();
  }
  replacer(key: string, value: any){
    // for eliminating circular json
    if(key == 'parent'){
      return null;
    }
    return value
  }
  async createProject(){
    const projectHandle = await this.directory.getDirectoryHandle(this.projectName, {
      create: true
    });
    const indexHtml = await projectHandle.getFileHandle('index.html', { create: true });
    const appCSS = await projectHandle.getFileHandle('app.css', { create: true });
    const meta = await projectHandle.getFileHandle('meta.json', { create: true });
    const assets = await projectHandle.getDirectoryHandle('assets', { create: true });
    const imgHandle = await assets.getDirectoryHandle('images', { create: true });
    const fontHandle = await assets.getDirectoryHandle('fonts', { create: true });
    this.state.projectDirHandle = projectHandle;
    this.newProjectOpen = false;
  }
  async openProject(){
    this.state.artBoardViewContainer.clear();
    this.releaseAssetFiles();
    this.state.activeViewContainer = null;
    this.state.activeItem.next(XDType.ArtBoard);
    this.state.projectDirHandle = await (window as any).showDirectoryPicker();
    const metaHandle = await this.state.projectDirHandle.getFileHandle('meta.json');
    const metaJson = await metaHandle.getFile();
    const metaString = await metaJson.text();
    if(metaString){
      const response = JSON.parse(metaString);
      this.state.styleData.next(response.styleData);
      this.state.layersData.next(response.layerData);
      this.state.createElements(response.layerData[0].children);
    }

    const assets = await this.state.projectDirHandle.getDirectoryHandle('assets', { create: true });

    const imgHandle = await assets.getDirectoryHandle('images', { create: true });
    await this.imageService.getImageLinks(imgHandle);

    const fontHandle = await assets.getDirectoryHandle('fonts', { create: true });
    await this.fontService.getFonts(fontHandle);

  }
  releaseAssetFiles(){
    combineLatest([
      this.imageService.imageList,
      this.fontService.fontFamilyList
    ]).pipe(
      take(1),
      tap(([images, fonts])=>{
        for(const key in images){
          URL.revokeObjectURL(images[key]);
        }
        for(const family in fonts){
          for(const font in fonts[family]){
            URL.revokeObjectURL(fonts[family][font].url);
          }
        }
        this.imageService.imageList.next({});
        this.fontService.fontFamilyList.next({});
      }),
    ).subscribe();
  }
}
