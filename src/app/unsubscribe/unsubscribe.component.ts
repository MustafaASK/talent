import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { UserAuthService } from '../user-auth.service';
import { AuditlogService } from '../shared/auditlog.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {

  color = "accent";
  showEmail = '';
  email = '';
  userid = '';
  pageStatus = '';
  showSpinner = false;
  constructor(private actRoute: ActivatedRoute,
    private router: Router,
    private auditlogService: AuditlogService,
    private userService: UserAuthService) { }

  ngOnInit(): void {
    this.actRoute.queryParams
      .subscribe(params => {
        console.log(params.status);  
        this.pageStatus = (params && params.status) ? params.status : '';
        this.email = params.email ? params.email : '';
        this.showEmail = this.auditlogService.decryptAES(params.email);
        // this.code = params.code;
        // this.state = params.state;
        // console.log(this.code);}
      
      });
    
    // if(this.actRoute.snapshot.params.email){
    //   localStorage.setItem('emailFromProfile', this.actRoute.snapshot.params.email);
    // }

  }

  unsubscribe(){
    let dataToPass = {
      "email": this.email.replace(/\ /g, '+'),
      "unSubscribe": 1
    }
    this.showSpinner = true;
      this.userService.unsubscribe(dataToPass).subscribe((response) => {
        this.showSpinner = false;
        console.log(response);
        if(response && response.Success){
          this.router.navigate(['/unsubscribe'], { queryParams: {'email':this.email, 'status':'unsubscribe-success' } });
        
          // this.router.navigate(['/unsubscribe']);
          // this.router.navigate(['/unsubscribe'], { queryParams: { 'status':'subscribe-success' } });
        }
        
        
  
      }, (error => {
  
      }));
  }

  subscribe(){
    let dataToPass = {
      "email": this.email,
      "unSubscribe": 0
    }
    this.showSpinner = true;
      this.userService.unsubscribe(dataToPass).subscribe((response) => {
        this.showSpinner = false;
        console.log(response);
        if(response && response.Success){
          this.router.navigate(['/unsubscribe'], { queryParams: {'email':this.email, 'status':'subscribe-success' } });
        
          // this.router.navigate(['/unsubscribe']);
          // this.router.navigate(['/unsubscribe'], { queryParams: { 'status':'subscribe-success' } });
        }
        
        
  
      }, (error => {
  
      }));
  }

}
