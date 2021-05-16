import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'xd-color-picker',
  templateUrl: './xd-color-picker.component.html',
  styleUrls: ['./xd-color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: XdColorPickerComponent
    }
  ]
})
export class XdColorPickerComponent implements ControlValueAccessor {
  defaultColor = 'none';
  isApplied: boolean = true;
  @Input() color: string = '#fff';
  @Input() label: string = '';

  touched = false;
  disabled = false;
  onTouched = () => {};
  onChange = (color: string) => {};
  onApplyColor(flag: boolean): void{
    this.markAsTouched();
    this.isApplied = flag
    if(this.isApplied) {
      this.onChange(this.color);
    }else{
      this.onChange(this.defaultColor);
    }
  }
  onColorChange(color: string): void{
    this.markAsTouched();
    this.color = color;
    if(this.isApplied){
      this.onChange(this.color);
    }
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  writeValue(color: string) {
    this.color = color;
  }
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
