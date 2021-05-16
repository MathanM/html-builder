import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() value = '';
  @Input() width = 50;

  onChange = (value: any) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

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
