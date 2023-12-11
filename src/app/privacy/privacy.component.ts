import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  constructor(
    private eleRef: ElementRef,
    private router: Router
    ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if(this.router.url == '/cookies'){
        let ele = this.eleRef.nativeElement.querySelector('#cookiesContainer');
        ele.scrollIntoView();
        setTimeout(() => {
          window.scrollBy(0, -100); 
        }, 1000);
        // ele.scrollTop = ele.scrollHeight;
      }
    }, 1000);
  }

}
