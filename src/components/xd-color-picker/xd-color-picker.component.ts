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
  @Input() toggle: boolean = false;
  @Input() color: string = '';
  @Input() label: string = '';

  touched = false;
  disabled = false;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  onTouched = () => {};
  onChange = (color: string) => {};
  onApplyColor(): void{
    this.markAsTouched();
    this.toggleChange.emit(this.toggle);
    this.onChange(this.color);
  }
  onColorChange(color: string): void{
    this.markAsTouched();
    this.color = color;
    this.toggleChange.emit(this.toggle);
    this.onChange(this.color);
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
