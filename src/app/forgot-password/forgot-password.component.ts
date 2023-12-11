import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserAuthService } from '../user-auth.service';
import { AuditlogService } from '../shared/auditlog.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm:FormGroup;
    submitted = false;
    color = "accent";
    jobData:any;

  constructor(
    private location: Location,
    private formBuilder:FormBuilder, 
    private userService: UserAuthService,
    private auditlogService:AuditlogService,
    private toastr: ToastrService,
    private router: Router) { 
    this.forgotPasswordForm  = formBuilder.group({
      email : new FormControl('', [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]),
     
    });
  }

  ngOnInit(): void {
    if(this.userService.isUserLoggedIn()){
      this.router.navigate(['/upload-resume']);
    }

    this.jobData = JSON.parse(localStorage.getItem("jobData") || '{}');
    
  }
  createForgotPasswordForm():void {

    this.submitted = true;

    if(!this.forgotPasswordForm.valid) {
      return;
    }
   // console.log(this.forgotPasswordForm.value);

    let finalobj = {
      "email" : this.auditlogService.encryptAES(this.forgotPasswordForm.value.email),
      //'frontendurl':environment.apiUrl
      'frontendurl':environment.FrontEndURLForUser,
      'accuickJobId':null
    }
    if(this.jobData){
      finalobj.accuickJobId = this.jobData.jobid;
    }
    
    this.userService.forgotPassword(finalobj).subscribe(
      (response)=>{
            if(response.Error){        
              this.toastr.error(response.Message);
            }
            // else if(response.data.Expired){
            //   $state.go('linkExpired');
            // }
            else if (response.Success) {
              this.toastr.success(response.Message);
               this.forgotPasswordForm.value.email = null;
              this.router.navigate(['/login']);
              
          }
      },(error)=>{

      })

  }

  goBack() {
    // window.history.back();
    this.location.back();

    console.log( 'goBack()...' );
  }

}
