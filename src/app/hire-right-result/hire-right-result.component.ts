

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UserAuthService } from 'src/app/user-auth.service';
import { DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-hire-right-result',
  templateUrl: './hire-right-result.component.html',
  styleUrls: ['./hire-right-result.component.css']
})
export class HireRightResultComponent implements OnInit {

  educationForm: FormGroup;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<HireRightResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditlogService: AuditlogService,
    private userService: UserAuthService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {
    this.educationForm = this.formBuilder.group({
      first: ['', Validators.required],
      last: ['', Validators.required],
      email: ['',Validators.required]
    });
  }
  showSpinner = false;
  candData: any;
  candOrderId: any;
  dataToPass:any;
  score:any;
  resultpdf:any;
  status:any;

  getCandidateScore():void{
    this.userService.getCandidateScore(this.candOrderId).subscribe((response:any) => {
          console.log(response);
          this.score = response;
          this.resultpdf = this.sanitizer.bypassSecurityTrustResourceUrl(decodeURIComponent(response.reportUrl));
          // this.showSpinner = false;
          // if (response && (response.status.toLowerCase() === 'complete')) {
          //   alert(123);
          //   // let ary = (response.assessmentAccessURL.uri.split('/'));

          //   // this.dialogRef.close((ary[ary.length -1]));
          // }
        }, (error => {

        }));
  }

  getCandidateStatus():void{

    this.userService.getCandidateStatus(this.candOrderId).subscribe((response:any) => {
          console.log(response);
          // this.showSpinner = false;
          this.status = response.status.toLowerCase();
          if (response && (response.status.toLowerCase() === 'complete')) {
            // alert(123);
            this.getCandidateScore();
            // let ary = (response.assessmentAccessURL.uri.split('/'));

            // this.dialogRef.close((ary[ary.length -1]));
          }
        }, (error => {

        }));
  }
  update() {
    if (this.educationForm.valid) {
      this.showSpinner = true;
      this.dataToPass = { 
                          "packageId": {"value": "JB-78TYWDR0M"}, 
                           "orderId": {"value": this.randomString(10)},
                          "candidate": { 
                          "first": this.educationForm.value.first, 
                          "last": this.educationForm.value.last, 
                          "email": this.educationForm.value.email 
                          }, 
                          "sendCandidateEmail": true
                        } 


      this.userService.orderHireSelect(this.dataToPass).subscribe((response) => {
        console.log(response);
        this.showSpinner = false;
        if (response && response.assessmentAccessURL) {
          let ary = (response.assessmentAccessURL.uri.split('/'));

          this.dialogRef.close((ary[ary.length -1]));
        }
      }, (error => {

      }));
    }
  }

  randomString(length:any) {
      var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var result = '';
      for ( var i = 0; i < length; i++ ) {
          result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      return result;
  }

  ngOnInit(): void {
    this.candOrderId = this.data.candOrderId;
    // this.candData = this.data.candData;
    // this.educationForm.patchValue({
    //   first: this.candData.first,
    //   last: this.candData.last,
    //   email: this.candData.email
    // });
    this.getCandidateStatus();
  }

  onClose(): void {
    // Close the dialog, return false
    if(this.candOrderId == '1'){
      this.staticAuditLogAPI('85', '');
    }
    if(this.candOrderId == '2'){
      this.staticAuditLogAPI('94', '');
    }

    this.dialogRef.close(false);
  }

  staticAuditLogAPI(actionId: string, jsonString: string) {
    let num:any = (localStorage.getItem("userId")); //number
    //let stringForm = num.toString();
    this.auditObj.actionId = (actionId);
    this.auditObj.userId = num;
    this.auditObj.jsonData = jsonString;
   // console.log(this.auditObj);
   //return false;
   this.auditlogService.staticAuditLogSave(this.auditObj).subscribe(
     (response) => {
       console.log(response);
       // if(response.Error){        
       //     this.toastr.error(response.Message);
       // }
       if(response.Success){

        }

     },
     (error) => {}
   )

}

}
