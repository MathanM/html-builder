import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  unit: BehaviorSubject<string> = new BehaviorSubject<string>('px');
  activeItem: BehaviorSubject<string> = new BehaviorSubject<string>('');
  styleData: BehaviorSubject<object> = new BehaviorSubject<object>({
    artBoard: {
      width: "1440px",
      background: '#fff',
      zoom: 0.833,
      designHelper: null
    }
  });
  constructor() { }
}
