import {Directive,HostListener} from '@angular/core'

@Directive({
selector: '[mobMask]'
})
export class MobDirective {

  
@HostListener('input', ['$event'])
onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    let trimmed = input.value.replace(/\s+/g, '');

    if (trimmed.length > 12) {
      trimmed = trimmed.substr(0, 12);
    }


    trimmed = trimmed.replace(/-/g,'');

     let numbers = [];
     
     numbers.push(trimmed.substr(0,3));
     if(trimmed.substr(3,2)!=="")
     numbers.push(trimmed.substr(3,3));
     if(trimmed.substr(6,3)!="")
     numbers.push(trimmed.substr(6,4));


    input.value = numbers.join('-');

  }
}