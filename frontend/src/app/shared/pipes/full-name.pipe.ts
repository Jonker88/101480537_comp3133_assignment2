import { Pipe, PipeTransform } from '@angular/core';

export interface NameFields {
  first_name: string;
  last_name: string;
}

@Pipe({
  name: 'fullName',
  standalone: true,
})
export class FullNamePipe implements PipeTransform {
  transform(value: NameFields | null | undefined): string {
    if (!value) return '';
    return `${value.first_name} ${value.last_name}`.trim();
  }
}
