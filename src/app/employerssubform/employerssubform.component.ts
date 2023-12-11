import { Component, OnInit, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-employerssubform',
  templateUrl: './employerssubform.component.html',
  styleUrls: ['./employerssubform.component.css']
})
export class EmployerssubformComponent implements OnInit {

  constructor(
    private eleRef: ElementRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if(this.router.url == '/returnshipprogram'){
        let ele = this.eleRef.nativeElement.querySelector('#returnshipcontainer');
        setTimeout(() => {
          ele.scrollIntoView();
          window.scrollBy(0, -100); 
        }, 250);
        // ele.scrollTop = ele.scrollHeight;
      }
    }, 250);

    setTimeout(() => {
      if(this.router.url == '/talentcommunity'){
        let ele = this.eleRef.nativeElement.querySelector('#talentcommunitycontainer');
        setTimeout(() => {
          ele.scrollIntoView();
          window.scrollBy(0, -100); 
        }, 250);
        // ele.scrollTop = ele.scrollHeight;
      }
    }, 250);
  }

}
