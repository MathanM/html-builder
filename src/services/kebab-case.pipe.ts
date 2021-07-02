import { Pipe, PipeTransform } from '@angular/core';
import {camel2KebabCase} from "../models/constant";

@Pipe({
  name: 'kebabCase'
})
export class KebabCasePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    return camel2KebabCase(value as string);
  }

}
