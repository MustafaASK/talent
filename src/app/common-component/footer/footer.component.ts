import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  title = 'website1';
  year = (new Date().getFullYear())
  FrontEndURLForUser:any;
  FrontEndURLForContactus:any;


  constructor() { }

  ngOnInit(): void {
    this.FrontEndURLForUser = environment.FrontEndURLForUser;
    this.FrontEndURLForContactus = environment.FrontEndURLForContactus;

  }

}
