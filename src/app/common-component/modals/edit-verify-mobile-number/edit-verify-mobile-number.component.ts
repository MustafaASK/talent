import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UserAuthService } from 'src/app/user-auth.service';

@Component({
  selector: 'app-edit-verify-mobile-number',
  templateUrl: './edit-verify-mobile-number.component.html',
  styleUrls: ['./edit-verify-mobile-number.component.css']
})
export class EditVerifyMobileNumberComponent implements OnInit {

  //verifyForm: FormGroup;

  verifycodeForm:FormGroup;
  submitted = false;
  hide = true;
  passwordhide = true;
  color = "accent";
  resetEmailParam: any;
  disabledName = false
  token:any;
  emailId:any;

  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  showSpinner = false;
  appliedmobileno = false;
  width:any;
  
  candDataPhone: any;
  candPageModalPopup: any;
  candDataOtp:any;

 
  sendNotificationForm:any;
  candDataPhoneEnable:boolean = false;

  

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditVerifyMobileNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditlogService: AuditlogService,
    private userService: UserAuthService,
    private toastr: ToastrService
  ) {
    // this.verifyForm = this.formBuilder.group({
    //   verificationcode: ['', Validators.required],
    // })

     //this.candDataOtp = "4567";



    this.verifycodeForm  = formBuilder.group({
      // email : new FormControl({value:this.emailId,disabled:true},[Validators.required,Validators.email]),
      // email: ['', Validators.required,Validators.email],
       otp : new FormControl(this.candDataOtp),
       confirmOtp : new FormControl('', [Validators.required]),
     });

   }
  

  ngOnInit(): void {
    this.candPageModalPopup = 1;
    this.candDataPhone = this.data.phone;
    this.staticAuditLogAPI('137', JSON.stringify(this.candDataPhone));

    //console.log(this.candDataPhone)

    //this.candPageModalPopup = this.data.modalPopup;
    //this.candDataPhone = this.data.phone;
  }

  SendVerification(num:any) {


   if(num=='' ){
     this.candPageModalPopup = 1;
     return; 
   }
   
    this.candPageModalPopup = 2;
    this.candDataOtp = Math.floor(1000 + Math.random() * 9000);
    this.verifycodeForm.patchValue({
      otp: this.candDataOtp
    });

    this.sendNotificationForm = ({
      "phone": this.candDataPhone,
      "otp": this.candDataOtp
   });

   console.log(this.sendNotificationForm)
   

    this.userService.SendVerificationCode(this.sendNotificationForm).subscribe((response) => {
      if (response && response.Status == 401) {
          this.toastr.error(response.message);
          this.candPageModalPopup = 1;
      }
      // if (response && response.Success) {
      //       //this.toastr.success(response.Message);
      //       this.candPageModalPopup = 2;

            

      // }
    }, (error => {

    }));

  //  var res =  this.userService.SendVerificationCode(this.sendNotificationForm);
  //  if(res) {
  //     //alert("valid otp")
  //     this.candPageModalPopup = 2;
      

  //  }else {
  //    alert("invalid otp no")
  //  }

    //console.log(this.sendNotificationForm);
    //this.dialogRef.close(true);
  }






  ReSendVerification() {

    this.candDataOtp = Math.floor(1000 + Math.random() * 9000);
    this.verifycodeForm.patchValue({
      otp: this.candDataOtp
    });

    this.sendNotificationForm = ({
      "phone": this.candDataPhone,
      "otp": this.candDataOtp
   });

   console.log(this.sendNotificationForm)

    this.userService.SendVerificationCode(this.sendNotificationForm).subscribe((response) => {
      if (response && response.Status == 401) {
          this.toastr.error(response.Message);
          this.candPageModalPopup = 1;
      }
      if (response && response.Success) {
            this.toastr.success(response.Message);
            this.candPageModalPopup = 2;
            

      }
    }, (error => {

    }));

  //  var res =  this.userService.SendVerificationCode(this.sendNotificationForm);
  //  if(res) {
  //     //alert("valid otp")
  //     this.candPageModalPopup = 2;
      

  //  }else {
  //    alert("invalid otp no")
  //  }

    //console.log(this.sendNotificationForm);
    //this.dialogRef.close(true);
  }

  

  Submit() {
    this.submitted = true;
     

    if(!this.verifycodeForm.valid) {
      return;
    }
    this.staticAuditLogAPI('140', JSON.stringify(this.candDataOtp));

    
    const response = {
      "Success": true,
      "Status": 200,
      "Message": "Message will be sent to Candidate shortly",
      "newmobileno": this.candDataPhone
    }

    //this.staticAuditLogAPI('138', JSON.stringify(this.candDataOtp));

    this.dialogRef.close(response);


  }

  
  onClose(): void {
    this.dialogRef.close();
    this.staticAuditLogAPI('138', JSON.stringify(this.candDataPhone));


  }

  staticAuditLogAPI(actionId: string, jsonString: string) {
    let num: any = (localStorage.getItem("userId")); //number
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
        if (response.Success) {

        }

      },
      (error) => { }
    )

  }


  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  openVerifyMobileModal() {
   
    this.candDataPhoneEnable = true //!this.candDataPhoneEnable;
  

  }

 
 

}
