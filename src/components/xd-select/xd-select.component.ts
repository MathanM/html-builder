import {Component, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'xd-select',
  templateUrl: './xd-select.component.html',
  styleUrls: ['./xd-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: XdSelectComponent
    }
  ]
})
export class XdSelectComponent implements ControlValueAccessor {
  @Input() value!: string;
  @Input() label!: string;
  @Input() options: string[] = [];

  touched = false;
  disabled = false;
  onTouched = () => {};
  onChange = (flag: string) => {};
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
  writeValue(flag: string) {
    this.value = flag;
  }
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
