import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ConfigService } from './../config/config.service';

@Component({
  selector: 'app-linkedin-success',
  templateUrl: './linkedin-success.component.html',
  styleUrls: ['./linkedin-success.component.css']
})
export class LinkedinSuccessComponent implements OnInit {
    code:any = '';
    access_token:any = '';
    postId:any;
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  private getForAccessToken():void{
    // this.http.post<any>('https://www.linkedin.com/oauth/v2/accessToken', { code: 'Angular POST Request Example' })
    //     .subscribe(data => {
    //       console.log(data);
    //         // this.access_token = data.access_token;
    //     })

        this.http.post<any>('https://www.linkedin.com/oauth/v2/accessToken', { code: 'AQQTETyShwTel66SUogQLgCecM0tQXfXTeTx2bfoXZpt6-yNiZbf-sQIHJsg0hhzN8f0zXWmvw3zJXqGOpkxZlmmprp4LFXBccWBjr2Y5lfbfH_TLwHXDhF6UZ26g1PnGeoGa5v0p59K5UDad_wSU5cKH2sdVofgq1TTYGKXtIiAxVCQyYI5Ypa9HGwcv-ZHY5CcK9udjaYQoAh72gU' }).subscribe(data => {
          console.log(data);
            // this.postId = data.id;
        })
  }

  ngOnInit(): void {
    // this.code = this.route.snapshot.params.code;
    // console.log(this.code);
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { orderby: "price" }
        this.code = params.code;
        console.log(this.code); // price
      }
    );

      this.getForAccessToken();
  }

}
