import { Component, TemplateRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UploadCertfileComponent } from './upload-certfile/upload-certfile.component';

import {MatCalendarCellClassFunction, MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-licence-certificate-form',
  templateUrl: './licence-certificate-form.component.html',
  styleUrls: ['./licence-certificate-form.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class LicenceCertificateFormComponent implements OnInit {

  MasterCertType = [
    { certTypeLookupID: 10009001, lookupValue: "license" },
    { certTypeLookupID: 10009002, lookupValue: "certificate" }
  ];



  bsModalRef: BsModalRef | undefined;

  dateMinEndDate: any;
  startDateEmp = new Date();
  endDateEmp = new Date();

  completedYear: any;

  LCFormObj: any;
  selectedFiles: File[] = [];
  certTypeList: any = [];

  showSpinner = false;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  @Input() categoryList: any;
  @Input() LCEditIndex: any;
  @Input() editedLCRecordData: any;
  @Output() addLC = new EventEmitter<any>();
  @Output() editLC = new EventEmitter<any>();
  @Output() closeLCForm = new EventEmitter<any>();

  constructor(private auditlogService: AuditlogService, private fb: FormBuilder,
    private userService: UserAuthService, private modalService: BsModalService,
    private toastr: ToastrService) { }


  onSelectFile(event: any) {
    console.log(event);
    // const allowedExts = ['pdf', 'doc', 'docx',''];
    const file = (event.addedFiles.length) ? event.addedFiles[0] : event.rejectedFiles[0];
    const name = file.name;
    const ext = name.substr(name.lastIndexOf('.') + 1);
    this.selectedFiles.length = 0;
    this.selectedFiles.push(...event.addedFiles);
    // this.onBlurMethod();
    // const allowed = allowedExts.some(e => e === ext);
    // if (!allowed) {
    //   this.toastr.error(`File Extension ".${ext}" is not allowed.`);
    //   return;
    // }

  }
  ngOnInit(): void {
    console.log(this.categoryList);

    // cur emp status obj
    let curEmpStatusobj = this.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10005;
    });
    this.certTypeList = (curEmpStatusobj && curEmpStatusobj.length) ? curEmpStatusobj[0].lookupsList : [];


    if (this.editedLCRecordData) {
      this.LCFormObj = this.fb.group({
        certTypeLookupID: this.editedLCRecordData.certTypeLookupID,
        authorityName: this.auditlogService.decryptAES(this.editedLCRecordData.authorityName),
        certName: this.auditlogService.decryptAES(this.editedLCRecordData.certName),
        completedYear: this.editedLCRecordData.completedYear ? (moment(this.editedLCRecordData.completedYear).format('YYYY-MM-DD')) : '',
        credentialID: this.auditlogService.decryptAES(this.editedLCRecordData.credentialID)
        //uploadCertFile:null
      });
    } else {
      this.LCFormObj = this.fb.group({
        certTypeLookupID: ['', Validators.required],
        authorityName: ['', Validators.required],
        certName: ['', Validators.required],
        completedYear: [''],
        credentialID: [''],
        // uploadCertFile :['']
      });
    }
  }


  removeFile(event: any): void {
    event.stopPropagation();
    this.selectedFiles.length = 0;
  }
  onBlurMethod() {

    let touched = true;
    if (this.LCFormObj.status !== "VALID") {

      // this.toastr.error(response.Message);
      return;//"error";
    }
    let aryData = (Object.keys(this.LCFormObj.controls));
    // for(let i=0 ; i< aryData.length; i++){
    //   if(!this.LCFormObj.controls[(aryData[i])].touched){
    //     touched = false;
    //     break;
    //   }
    // }
    if (this.LCFormObj.valid) {
      console.log("touched all boxes");

      // let todo = {
      //   "userId" : localStorage.getItem('userId'),
      //   "certTypeLookupID": this.LCFormObj.value.certTypeLookupID,
      //   "authorityName"  : this.auditlogService.encryptAES(this.LCFormObj.value.authorityName),
      //   "certName" : this.auditlogService.encryptAES(this.LCFormObj.value.certName),
      //   "completedYear" : (moment(this.LCFormObj.value.completedYear).format('YYYY-MM-DD')),
      //   "credentialID":this.auditlogService.encryptAES(this.LCFormObj.value.credentialID),
      //   "isManual ": 0,
      //   "userCertID" : 0,
      //   "uploadCertFile" :''
      // }
      // if (!this.editedLCRecordData && !this.selectedFiles.length) {
      //   return;
      // }
      let formData = new FormData();
      let userId: any = localStorage.getItem("userId");
      formData.append("userId", userId);
      formData.append("certTypeLookupID", this.LCFormObj.value.certTypeLookupID);
      formData.append("authorityName", this.auditlogService.encryptAES(this.LCFormObj.value.authorityName));
      formData.append("certName", this.auditlogService.encryptAES(this.LCFormObj.value.certName));
      formData.append("completedYear" , this.LCFormObj.value.completedYear ? (moment(this.LCFormObj.value.completedYear).format('YYYY-MM-DD')) : '');
      formData.append("credentialID", this.auditlogService.encryptAES(this.LCFormObj.value.credentialID));
      formData.append("isManual", '1');
      // formData.append("resume", this.files[0]);

      if (this.editedLCRecordData) {
        // formData.userCertID = this.editedLCRecordData.userCertID;
        formData.append("userCertID", this.editedLCRecordData.userCertID);
        if (this.selectedFiles && this.selectedFiles.length) {
          formData.append("uploadCertFile", this.selectedFiles[0]);
        }
        // formData.append("uploadCertFile", (this.editedLCRecordData.userCertID ? ( ? this.selectedFiles[0] :('null' || '')) : (this.selectedFiles[0])));

      } else {
        if (this.selectedFiles && this.selectedFiles.length) {
          formData.append("uploadCertFile", this.selectedFiles[0]);
        }

        formData.append("userCertID", '0');
      }
      this.showSpinner = true;

      this.userService.saveoreditcertifications(formData).subscribe((response) => {
        // this.listTodos();
        console.log(response);
        this.showSpinner = false;
        let todo = {
          "userId": localStorage.getItem('userId'),
          "certTypeLookupID": this.LCFormObj.value.certTypeLookupID,
          "authorityName": this.auditlogService.encryptAES(this.LCFormObj.value.authorityName),
          "certName": this.auditlogService.encryptAES(this.LCFormObj.value.certName),
          "completedYear" : this.LCFormObj.value.completedYear ? (moment(this.LCFormObj.value.completedYear).format('YYYY-MM-DD')) : '',
          "credentialID": this.auditlogService.encryptAES(this.LCFormObj.value.credentialID),
          "isManual ": 0,
          "userCertID": response.userCertID,
          "uploadCertFile": ''
        }
        // let obj = {
        //   "userId" : localStorage.getItem('userId'),
        //   "userCertID" : 0,
        //   "certTypeLookupID": this.LCFormObj.value.certTypeLookupID,
        //   "authorityName"  : this.auditlogService.encryptAES(this.LCFormObj.value.authorityName),
        //   "certName" : this.auditlogService.encryptAES(this.LCFormObj.value.certName),
        //   "completedYear" : (moment(this.LCFormObj.value.completedYear).format('YYYY-MM-DD')),
        //   "credentialID":this.auditlogService.encryptAES(this.LCFormObj.value.credentialID),
        //   "isManual ": 0,
        //   "uploadCertFile" :''

        // }
        // userEmploymentId
        // userCertID

        if (this.editedLCRecordData) {
          this.editLC.emit(todo);
        } else {
          this.addLC.emit(todo);

        }

      }, (error => {
        this.showSpinner = false;

      }));
    }
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    //this.endDateCtrl = this.empFormObj.get('endDate') as FormControl;
    // console.log("normalizedYear: ", normalizedYear.toDate());
    // const ctrlValue = this.LCFormObj.get('completedYear').value;
    const val = (normalizedYear.toDate());
    this.LCFormObj.get('completedYear').setValue(val);
    datepicker.close();
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.LCFormObj.get('completedYear').value;
    ctrlValue.month(normalizedMonth.month());
    this.LCFormObj.get('completedYear').setValue(ctrlValue);
    datepicker.close();
  }


  closeInnerForm() {
    let type: string;
    if (this.editedLCRecordData) {
      this.staticAuditLogAPI('43', '');
      type = 'edit';
    } else {
      this.staticAuditLogAPI('40', '');
      type = 'add';
    }
    this.closeLCForm.emit(type);
  }

  public openModalWithComponent() {
    /* this is how we open a Modal Component from another component */
    this.bsModalRef = this.modalService.show(UploadCertfileComponent);
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
