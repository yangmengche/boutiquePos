import { Pipe, PipeTransform } from '@angular/core';
import { PAYBY_MAP } from '../model/def'

@Pipe({
  name: 'payBy'
})
export class PayByPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return PAYBY_MAP[value];
  }

}
