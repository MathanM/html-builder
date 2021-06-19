import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'xd-input',
  templateUrl: './xd-input.component.html',
  styleUrls: ['./xd-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: XdInputComponent
    }
  ]
})
export class XdInputComponent implements ControlValueAccessor  {
  @Input() label = '';
  @Input() type = 'text'
  @Input() value!: any;
  @Input() width = 50;
  @Input() step = 1;

  onChange = (value: any) => {};
  onTouched = () => {};
  touched = false;
  @Input() disabled = false;
  @Input() readonly!: boolean;

  onKeyDown(e: KeyboardEvent){
    if(this.type == 'number'){
      let factor = this.step;
      if(e.ctrlKey){
        factor = 100 * this.step;
      }else if(e.shiftKey){
        factor = 10 * this.step;
      }
      if(e.key == "ArrowUp"){
        e.preventDefault();
        this.value = Math.round((this.value + factor) * 100) / 100;
      }else if(e.key == "ArrowDown"){
        e.preventDefault();
        this.value = Math.round((this.value - factor) * 100) / 100;
      }
    }else if(this.value){
      const numSelector = /(-\d+|\d+)/;
      const numMatch = this.value.match(numSelector);
      if(numMatch){
        const num = parseInt(numMatch[0]);
        let factor = this.step;
        if(e.ctrlKey){
          factor = 100 * this.step;
        }else if(e.shiftKey){
          factor = 10 * this.step;
        }
        if(e.key == "ArrowUp"){
          const numStr = (num + factor).toString();
          this.value = this.value.replace(numMatch[0], numStr);
        }else if(e.key == "ArrowDown"){
          const numStr = (num - factor).toString();
          this.value = this.value.replace(numMatch[0], numStr);
        }
      }
    }
  }

  onBlur(): void {
    this.markAsTouched();
    this.onChange(this.value);
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
