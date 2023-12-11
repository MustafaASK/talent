import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePasswordComponent } from '../common-component/modals/update-password/update-password.component';
import { EditVerifyMobileNumberComponent } from '../common-component/modals/edit-verify-mobile-number/edit-verify-mobile-number.component';
import { UserAuthService } from '../user-auth.service';
import { AuditlogService } from '../shared/auditlog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  isMobile = false;
  verifiedPhone = false;
  educationForm: FormGroup;
  sameNumerphoneNo: any;
  dbStatus = false;
  datapassPhoneNo: any;
  resultSendVefirifactinCode: any;
  dataToPass: any;
  isSmartyValid = false;
  inSmartyValidation = false;
  verifiedPopUpStatus = false;
  userEmail = '';

  candData = {
    phoneNo: ''
  };

  constructor(public dialog: MatDialog,
    private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) {
    this.educationForm = this.formBuilder.group({
      phoneNo: ['']
    });
  }

  validateDuplicate() {
    this.sameNumerphoneNo = false;
    // console.log(this.educationForm);
    if ((this.educationForm.value.phoneNo == this.candData.phoneNo) && this.dbStatus) {
      this.sameNumerphoneNo = true;

    } else {
      this.sameNumerphoneNo = false;

    }
    // t

  }
  getreviewdetails() {
    // console.log(this.loginForm.value);
    this.userService.getreviewdetails().subscribe((response: any) => {
      if (response && response.Status == 401) {
        this.toastr.error(response.Message);
      }
      if (response && response.Status) {
        var mobilenum: any = (response.contactInfoList[0].phoneNo) ? this.auditlogService.decryptAES(response.contactInfoList[0].phoneNo) : '';
        this.userEmail = (response.contactInfoList[0].email) ? this.auditlogService.decryptAES(response.contactInfoList[0].email) : '';

        // var mobilenum = response.contactInfoList[0].phoneNo;
        if (mobilenum && mobilenum.indexOf("-") == "-1") {

          mobilenum = mobilenum.trim();


          let numbers = [];

          numbers.push(mobilenum.substr(0, 3));
          if (mobilenum.substr(3, 2) !== "")
            numbers.push(mobilenum.substr(3, 3));
          if (mobilenum.substr(6, 3) != "")
            numbers.push(mobilenum.substr(6, 4));
          mobilenum = numbers.join('-');
        }

        this.educationForm.patchValue({
          phoneNo: mobilenum
        });
      }
    }, (error => {

    }));
  }
  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  SaveVerifiedPhoneNumber(obj: any) {
    return
    let todo1 = {
      "userId": localStorage.getItem('userId'),
      "phoneNo": this.auditlogService.encryptAES(obj.value.phoneNo),
      "verifiedPhone": obj.value.verifiedPhone,
      "isManual": 0

    }
    console.log(obj)

    // this.showSpinner = true;
    this.userService.saveoreditbasicinformation(todo1).subscribe((response) => {
      // this.listTodos();

      //this.showSpinner = false;

    }, (error => {

    }));



  }
  openVerifyMobileModal(str: any) {



    if (str == "edit-profile") {

      if (this.educationForm.controls.phoneNo.status != 'VALID') {
        return;
      }

      this.datapassPhoneNo = this.educationForm.value.phoneNo
    }


    let dialogRef = this.dialog.open(EditVerifyMobileNumberComponent, {
      // height: 'calc(100% - 330px)',
      // width: 'calc(100% - 800px)',
      //  height: 'calc(100% - 300px)',
      //  width: 'calc(100% - 800px)',
      maxWidth: "850px",
      data: { phone: this.datapassPhoneNo, modalPopup: '1' },
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.resultSendVefirifactinCode = dialogResult;
      if (this.resultSendVefirifactinCode) {
        // this.toastr.success(this.resultSendVefirifactinCode.Message);
        if (str == "edit-profile") {

          this.educationForm.patchValue({
            phoneNo: this.resultSendVefirifactinCode.newmobileno,
            userId: localStorage.getItem('userId'),
            isManual: 1
          });

          this.verifiedPhone = true;
          this.verifiedPopUpStatus = true;
          this.educationForm.value.verifiedPhone = this.verifiedPhone;
          console.log(this.educationForm.value);
          this.educationForm.markAsDirty();
          this.SaveVerifiedPhoneNumber(this.educationForm);


          //this.update("otp");

        }

      }
    }); //
  }

  isEditVerifiedPhone() {
    this.verifiedPhone = false;
    // console.log(this.educationForm);
    if ((this.educationForm.value.phoneNo == this.candData.phoneNo)) {
      this.sameNumerphoneNo = true;

    } else {
      this.sameNumerphoneNo = false;

    }
    // this.SaveVerifiedPhoneNumber(this.educationForm);

  }

  ngOnInit(): void {
    this.getreviewdetails();
    this.isMobile = window.innerWidth < 615 ? true : false;
  }

  openUpdatePassword(type: any): void {
    const dialogRef = this.dialog.open(UpdatePasswordComponent, {
      // height: '55%',
      height: this.isMobile ? 'calc(100%)' : '',
      width: this.isMobile ? 'calc(100%)' : 'calc(35%)',
      maxWidth: this.isMobile ? 'calc(100%)' : '',
      // hasBackdrop: false,
    });


  }

}
