import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'titlecase'})
export class TitlecasePipe implements PipeTransform {
  transform(value: any): string {
    return value.replace(/(^\w{1})|(\s+\w{1})/g, 
       (letter : string) => letter.toUpperCase());
  }

}