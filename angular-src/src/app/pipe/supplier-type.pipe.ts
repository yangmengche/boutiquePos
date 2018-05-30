import { Pipe, PipeTransform } from '@angular/core';
import { SUPPLIER_TYPE_MAP } from '../model/def'
@Pipe({
  name: 'supplierType'
})
export class SupplierTypePipe implements PipeTransform {

  transform(value: string): string {
    return SUPPLIER_TYPE_MAP[value];
  }

}
