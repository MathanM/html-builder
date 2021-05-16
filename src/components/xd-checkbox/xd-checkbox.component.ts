import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'xd-checkbox',
  templateUrl: './xd-checkbox.component.html',
  styleUrls: ['./xd-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: XdCheckboxComponent
    }
  ]
})
export class XdCheckboxComponent implements ControlValueAccessor {
  @Input() value: boolean = false;
  @Input() id!: string;
  @Input() label!: string;

  touched = false;
  disabled = false;
  onTouched = () => {};
  onChange = (flag: boolean) => {};
  onToggle(): void{
    this.markAsTouched();
    this.onChange(this.value);
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
  writeValue(flag: boolean) {
    this.value = flag;
  }
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
