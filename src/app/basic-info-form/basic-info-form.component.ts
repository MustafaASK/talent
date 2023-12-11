import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import * as moment from 'moment';
import { EditVerifyMobileNumberComponent } from '../common-component/modals/edit-verify-mobile-number/edit-verify-mobile-number.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { MatValidateAddressDirective } from '@angular-material-extensions/google-maps-autocomplete';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-basic-info-form',
  templateUrl: './basic-info-form.component.html',
  styleUrls: ['./basic-info-form.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class BasicInfoFormComponent implements OnInit {

  aptValue = ''
  color = "accent";
  resumeBuilderFrom: any;

  //dateMinArrival = new Date();
  dateMinEndDate: any;
  startDateEmp = new Date();
  endDateEmp = new Date();
  basicInfoFormObj: any;

  @Input() editedBasicInfoRecordData: any;

  canEditCode: any;
  canEditCodefirstname: any;
  canEditCodelastname: any;
  canEditCodeemail: any;
  canEditCodephone: any;


  canEditCodeaddress: any;
  canEditCodeaddress2: any;
  canEditCodecity: any;
  canEditCodestate: any;
  canEditCodecountry: any;
  canEditCodezip: any;

  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  selectedJob: any;



  resultSendVefirifactinCode: any
  resultcodeMatch: any
  verifiedPhone: any;
  datapassPhoneNo: any;

  searchOption: any;
  showSpinner: any;

  sameNumerphoneNo: any;
  dbmobileNocheck: any;


  @ViewChild('search') search: ElementRef | undefined;
  @ViewChild('search1') search1: ElementRef | undefined;

  private onNewPlaceResult: EventEmitter<any> = new EventEmitter();
  private addressValidator: MatValidateAddressDirective = new MatValidateAddressDirective();

  @Input() isResumeBuildeBasicinfopage: any;
  basicInfoFormObjResumBuilder: any;

  @Output() public dataToParent = new EventEmitter<any>();
  @Output() public firstNameDataPass = new EventEmitter<any>();
  @Output() public lastNameDataPass = new EventEmitter<any>();
  @Output() public emailDataPass = new EventEmitter<any>();
  @Output() public addressLineDataPass = new EventEmitter<any>();
  @Output() public APTDataPass = new EventEmitter<any>();
  @Output() public cityDataPass = new EventEmitter<any>();
  @Output() public stateDataPass = new EventEmitter<any>();
  @Output() public countryDataPass = new EventEmitter<any>();
  @Output() public zipcodeDataPass = new EventEmitter<any>();

  isSmartyValid = false;
  inSmartyValidation = false;
  verifiedPopUpStatus = false;
  addressValid = false;
  dbStatus = false;
  dbStatus1: any;
  // tempSearchText='';

  mobilenum: any;
  stuobj = {

    "NewphoneNo": '',
    "newdbstatus": ""


  }

  myControl = new FormControl('');
  options: any = [];
  // filteredOptions: <string[]>;

  constructor(
    private auditlogService: AuditlogService,
    private fb: FormBuilder,
    private userService: UserAuthService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private _commonService: CommonService
  ) {

    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );
  }



  //  private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }

  ngOnInit(): void {
    this.loaddata();
  }

  loaddata() {
    console.log('ngOnchange');
    if (this.editedBasicInfoRecordData && this.editedBasicInfoRecordData.address) {
      this.addressValid = true;

    }

    if (this.isResumeBuildeBasicinfopage) {
      // Resume-builder 


      if (this.editedBasicInfoRecordData) {

        this.mobilenum = this.auditlogService.decryptAES(this.editedBasicInfoRecordData.phoneNo);
        if (this.mobilenum && this.mobilenum.indexOf("-") == -1) {

          this.mobilenum = this.mobilenum.trim();
          let numbers = [];
          numbers.push(this.mobilenum.substr(0, 3));
          if (this.mobilenum.substr(3, 2) !== "")
            numbers.push(this.mobilenum.substr(3, 3));
          if (this.mobilenum.substr(6, 3) != "")
            numbers.push(this.mobilenum.substr(6, 4));
          this.mobilenum = numbers.join('-');
        }


        this.basicInfoFormObjResumBuilder = this.fb.group({
          "firstName": this.auditlogService.decryptAES(this.editedBasicInfoRecordData.firstName),
          "lastName": this.auditlogService.decryptAES(this.editedBasicInfoRecordData.lastName),
          "email": this.auditlogService.decryptAES(this.editedBasicInfoRecordData.email),
          "phoneNo": this.mobilenum,
          "zipcode": this.auditlogService.decryptAES(this.editedBasicInfoRecordData.zipcode),
          "cityName": this.editedBasicInfoRecordData.cityName ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.cityName) : '',
          "stateName": this.editedBasicInfoRecordData.stateName ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.stateName) : '',
          "countryName": this.editedBasicInfoRecordData.countryName ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.countryName) : '',
          "jobTitle": this.editedBasicInfoRecordData.jobTitle ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.jobTitle) : '',

          "address": this.editedBasicInfoRecordData.address ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.address) : '',
          "apt": this.editedBasicInfoRecordData.apt ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.apt) : ''
        });

        this.verifiedPhone = (this.editedBasicInfoRecordData.verifiedPhone ? this.editedBasicInfoRecordData.verifiedPhone : false);
        this.dbStatus = this.editedBasicInfoRecordData.verifiedPhone;



      } else {
        this.basicInfoFormObjResumBuilder = this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          phoneNo: [''],
          email: new FormControl('', [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]),
          zipcode: [''],
          jobTitle: [''],
          cityName: [''],
          stateName: [''],
          countryName: [''],
          address: [''],
          apt: ['']
        });
        //this.verifiedPhone = false;
      }

      /********* */
      this.basicInfoFormObjResumBuilder.get("firstName").statusChanges.subscribe((value: any) => {
        this.firstNameDataPass.emit(value);
      });

      this.basicInfoFormObjResumBuilder.get("lastName").statusChanges.subscribe((value: any) => {
        this.lastNameDataPass.emit(value);
      });

      this.basicInfoFormObjResumBuilder.get("email").statusChanges.subscribe((value: any) => {
        this.emailDataPass.emit(value);
      });

      this.basicInfoFormObjResumBuilder.get("address").statusChanges.subscribe((value: any) => {
        this.addressLineDataPass.emit(value);
      });
      this.basicInfoFormObjResumBuilder.get("apt").statusChanges.subscribe((value: any) => {
        this.APTDataPass.emit(value);
      });
      this.basicInfoFormObjResumBuilder.get("cityName").statusChanges.subscribe((value: any) => {
        this.cityDataPass.emit(value);
      });
      this.basicInfoFormObjResumBuilder.get("stateName").statusChanges.subscribe((value: any) => {
        this.stateDataPass.emit(value);
      });
      this.basicInfoFormObjResumBuilder.get("countryName").statusChanges.subscribe((value: any) => {
        this.countryDataPass.emit(value);
      });
      this.basicInfoFormObjResumBuilder.get("zipcode").statusChanges.subscribe((value: any) => {
        this.zipcodeDataPass.emit(value);
      });

      /*************** */
      this.firstNameDataPass.emit(this.basicInfoFormObjResumBuilder.get("firstName").status);
      this.lastNameDataPass.emit(this.basicInfoFormObjResumBuilder.get("lastName").status);
      this.emailDataPass.emit(this.basicInfoFormObjResumBuilder.get("email").status);
      this.addressLineDataPass.emit(this.basicInfoFormObjResumBuilder.get("address").status);
      this.APTDataPass.emit(this.basicInfoFormObjResumBuilder.get("apt").status);
      this.cityDataPass.emit(this.basicInfoFormObjResumBuilder.get("cityName").status);
      this.stateDataPass.emit(this.basicInfoFormObjResumBuilder.get("stateName").status);
      this.countryDataPass.emit(this.basicInfoFormObjResumBuilder.get("countryName").status);
      this.zipcodeDataPass.emit(this.basicInfoFormObjResumBuilder.get("zipcode").status);

    } else {
      //  
      // create resume build 
      if (this.editedBasicInfoRecordData) {
        // this.canEditCode = false;


        this.canEditCodefirstname = false;
        this.canEditCodelastname = false;
        this.canEditCodeemail = false;
        this.canEditCodephone = false;

        this.canEditCodeaddress = false;
        this.canEditCodeaddress2 = false;
        this.canEditCodecity = false;
        this.canEditCodestate = false;
        this.canEditCodecountry = false;
        this.canEditCodezip = false;

        // debugger;
        // var mobilenum = this.auditlogService.decryptAES(this.editedBasicInfoRecordData.phoneNo);
        // if(mobilenum && mobilenum.indexOf("-") == -1){

        //  mobilenum = mobilenum.trim();
        //  let numbers = [];
        //  numbers.push(mobilenum.substr(0,3));
        //  if(mobilenum.substr(3,2)!=="")
        //  numbers.push(mobilenum.substr(3,3));
        //  if(mobilenum.substr(6,3)!="")
        //  numbers.push(mobilenum.substr(6,4));
        //  mobilenum = numbers.join('-');
        // }

        //console.log(mobilenum)

        this.mobilenum = this.auditlogService.decryptAES(this.editedBasicInfoRecordData.phoneNo);
        if (this.mobilenum && this.mobilenum.indexOf("-") == -1) {

          this.mobilenum = this.mobilenum.trim();
          let numbers = [];
          numbers.push(this.mobilenum.substr(0, 3));
          if (this.mobilenum.substr(3, 2) !== "")
            numbers.push(this.mobilenum.substr(3, 3));
          if (this.mobilenum.substr(6, 3) != "")
            numbers.push(this.mobilenum.substr(6, 4));
          this.mobilenum = numbers.join('-');
        }

        this.basicInfoFormObj = this.fb.group({
          "firstName": this.auditlogService.decryptAES(this.editedBasicInfoRecordData.firstName),
          "lastName": this.auditlogService.decryptAES(this.editedBasicInfoRecordData.lastName),
          "email": this.auditlogService.decryptAES(this.editedBasicInfoRecordData.email),
          "phoneNo": this.mobilenum,
          "zipcode": this.auditlogService.decryptAES(this.editedBasicInfoRecordData.zipcode),
          "cityName": this.editedBasicInfoRecordData.cityName ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.cityName) : '',
          "stateName": this.editedBasicInfoRecordData.stateName ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.stateName) : '',
          "countryName": this.editedBasicInfoRecordData.countryName ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.countryName) : '',
          "jobTitle": this.editedBasicInfoRecordData.jobTitle ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.jobTitle) : '',
          "address": this.editedBasicInfoRecordData.address ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.address) : '',
          "apt": this.editedBasicInfoRecordData.apt ? this.auditlogService.decryptAES(this.editedBasicInfoRecordData.apt) : ''
        });

        this.verifiedPhone = (this.editedBasicInfoRecordData.verifiedPhone ? this.editedBasicInfoRecordData.verifiedPhone : false);

        this.dbStatus = this.editedBasicInfoRecordData.verifiedPhone;


      } else {

        this.canEditCodefirstname = true;
        this.canEditCodelastname = true;
        this.canEditCodeemail = true;
        this.canEditCodephone = true;

        this.canEditCodeaddress = true;
        this.canEditCodeaddress2 = true;
        this.canEditCodecity = true;
        this.canEditCodestate = true;
        this.canEditCodecountry = true;
        this.canEditCodezip = true;


        // this.verifiedPhone = false;

        this.basicInfoFormObj = this.fb.group({

          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          phoneNo: [''],
          email: ['', Validators.required],
          zipcode: [''],
          jobTitle: [''],
          cityName1: [''],
          stateName: [''],
          countryName: [''],
          address: [''],
          apt: ['']
        });
      }

      /********* */
      this.basicInfoFormObj.get("firstName").statusChanges.subscribe((value: any) => {
        this.firstNameDataPass.emit(value);
      });

      this.basicInfoFormObj.get("lastName").statusChanges.subscribe((value: any) => {
        this.lastNameDataPass.emit(value);
      });

      this.basicInfoFormObj.get("email").statusChanges.subscribe((value: any) => {
        this.emailDataPass.emit(value);
      });

      this.basicInfoFormObj.get("address").statusChanges.subscribe((value: any) => {
        this.addressLineDataPass.emit(value);
      });

      this.basicInfoFormObj.get("apt").statusChanges.subscribe((value: any) => {
        this.APTDataPass.emit(value);
      });

      this.basicInfoFormObj.get("cityName").statusChanges.subscribe((value: any) => {
        this.cityDataPass.emit(value);
      });

      this.basicInfoFormObj.get("stateName").statusChanges.subscribe((value: any) => {
        this.stateDataPass.emit(value);
      });

      this.basicInfoFormObj.get("countryName").statusChanges.subscribe((value: any) => {
        this.countryDataPass.emit(value);
      });

      this.basicInfoFormObj.get("zipcode").statusChanges.subscribe((value: any) => {
        this.zipcodeDataPass.emit(value);
      });

      /*************** */
      this.firstNameDataPass.emit(this.basicInfoFormObj.get("firstName").status);
      this.lastNameDataPass.emit(this.basicInfoFormObj.get("lastName").status);
      this.emailDataPass.emit(this.basicInfoFormObj.get("email").status);
      this.addressLineDataPass.emit(this.basicInfoFormObj.get("address").status);
      this.APTDataPass.emit(this.basicInfoFormObj.get("apt").status);
      this.cityDataPass.emit(this.basicInfoFormObj.get("cityName").status);
      this.stateDataPass.emit(this.basicInfoFormObj.get("stateName").status);
      this.countryDataPass.emit(this.basicInfoFormObj.get("countryName").status);
      this.zipcodeDataPass.emit(this.basicInfoFormObj.get("zipcode").status);

    }
  }
  onChange(term: any) {
    // this._commonService.SmartyStreetsCall(term).then((data: any) => {
    //     // this.addressOptions = data.result as any[];
    //     console.log(data);
    // }).catch();
  }
  buildAddress(suggestion: any) {
    let whiteSpace = "";
    let sentanse = JSON.parse(JSON.stringify(suggestion));
    if (sentanse.secondary) {
      if (sentanse.entries > 1) {
        sentanse.secondary += " (" + sentanse.entries + " entries)";
      }
      whiteSpace = " ";
    }
    return sentanse.street_line + whiteSpace + sentanse.secondary + " " + sentanse.city + ", " + sentanse.state + " " + sentanse.zipcode;
  }
  buildAddressForCall(suggestion: any) {
    let whiteSpace = "";
    let sentanse = JSON.parse(JSON.stringify(suggestion));
    if (sentanse.secondary) {
      if (sentanse.entries > 1) {
        sentanse.secondary += " (" + sentanse.entries + ")";
      }
      whiteSpace = " ";
    }
    return sentanse.street_line + whiteSpace + sentanse.secondary + " " + sentanse.city + " " + sentanse.state + ", " + sentanse.zipcode;
  }



  placeSelected1(event: any, trigger: MatAutocompleteTrigger, data: any, formtype: any) {
    console.log(data);
  }

  placeSelected(event: any, trigger: MatAutocompleteTrigger, data: any, formtype: any) {
    console.log("selected dataaa", data);
    if (data.data.entries > 1) {
      this.options = [];

      if (formtype == 'resume-builder') {
        this.basicInfoFormObjResumBuilder.patchValue({
          address: data.name,
        });
        // this.tempSearchText = this.basicInfoFormObjResumBuilder.value.address;
      } else {
        this.basicInfoFormObj.patchValue({
          address: data.name,
        });
        // this.tempSearchText = this.basicInfoFormObj.value.address;
      }

      let queryParam = "key=" + environment.smartyKey + "&search=" + (data.data.street_line) + "&selected=" + (data.callName) + "&source=all"

      this.userService.smartyStreetsSearch(queryParam).subscribe((response) => {
        console.log(response);
        for (let i = 0; i < response.suggestions.length; i++) {
          let name = this.buildAddress(response.suggestions[i]);
          let callName = this.buildAddressForCall(response.suggestions[i]);
          let obj = {
            "name": name,
            "callName": callName,
            "data": response.suggestions[i]
          }

          this.options.push(obj);

        }

        // event.stopPropagation();
        trigger.openPanel();
      }, (error => {

      }));


    } else {


      if (formtype == 'resume-builder') {
        this.basicInfoFormObjResumBuilder.patchValue({
          address: data.data.street_line,
          apt: data.data.secondary,
          cityName: data.data.city,
          stateName: data.data.state,
          countryName: "USA",
          zipcode: data.data.zipcode
        });
        // this.canEditCodezip = true;
        // this.canEditCodecountry = true;
        // this.canEditCodestate = true;
        // this.canEditCodecity = true;
        this.isSmartyValid = false;
        this.inSmartyValidation = false;
        this.onBlurMethodResumBuilder()
      } else {

        this.basicInfoFormObj.patchValue({
          address: data.data.street_line,
          apt: data.data.secondary,
          cityName: data.data.city,
          stateName: data.data.state,
          countryName: "USA",
          zipcode: data.data.zipcode
        });
        // this.canEditCodezip = true;
        // this.canEditCodecountry = true;
        // this.canEditCodestate = true;
        // this.canEditCodecity = true;
        this.isSmartyValid = false;
        this.inSmartyValidation = false;
        this.onBlurMethod()
      }
    }

  }


  onAutocompleteSelected(res: any, formtype: any) {
    this.options = [];

    let queryParam = "";
    if (formtype == 'resume-builder') {
      queryParam = "key=" + environment.smartyKey + "&search=" + (this.basicInfoFormObjResumBuilder.value.address) + "&selected=&source=all";
    } else {
      queryParam = "key=" + environment.smartyKey + "&search=" + (this.basicInfoFormObj.value.address) + "&selected=&source=all";
    }
    this.userService.smartyStreetsSearch(queryParam).subscribe((response) => {
      // let response = {"suggestions":[{"street_line":"Lucas Building","secondary":"","city":"Des Moines","state":"IA","zipcode":"50319","entries":0},{"street_line":"Lucas Building","secondary":"Fl","city":"Des Moines","state":"IA","zipcode":"50319","entries":3},{"street_line":"Lucas Building","secondary":"Rm","city":"Des Moines","state":"IA","zipcode":"50319","entries":18}]};

      for (let i = 0; i < response.suggestions.length; i++) {
        let name = this.buildAddress(response.suggestions[i]);
        let callName = this.buildAddressForCall(response.suggestions[i]);
        let obj = {
          "name": name,
          "callName": callName,
          "data": response.suggestions[i]
        }

        this.options.push(obj);

      }

    }, (error => {

    }));

  }


  isEditFirstName() {
    //setTimeout(() => this.basicInfoFormObj.controls.firstName.nativeElement.focus());
    this.canEditCodefirstname = true;
    this.canEditCodelastname = false;
    this.canEditCodeemail = false;
    this.canEditCodephone = false;
    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = false;
    this.canEditCodestate = false;
    this.canEditCodecountry = false;
    this.canEditCodezip = false;


  }
  isEditLastName() {
    this.canEditCodefirstname = false;
    this.canEditCodelastname = true;
    this.canEditCodeemail = false;
    this.canEditCodephone = false;
    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = false;
    this.canEditCodestate = false;
    this.canEditCodecountry = false;
    this.canEditCodezip = false;


  }
  isEditEmail() {
    this.canEditCodefirstname = false;
    this.canEditCodelastname = false;
    this.canEditCodeemail = true;
    this.canEditCodephone = false;
    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = false;
    this.canEditCodestate = false;
    this.canEditCodecountry = false;
    this.canEditCodezip = false;


  }

  isEditPhone() {
    this.canEditCodefirstname = false;
    this.canEditCodelastname = false;
    this.canEditCodeemail = false;
    this.canEditCodephone = true;
    this.verifiedPhone = false;
    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = false;
    this.canEditCodestate = false;
    this.canEditCodecountry = false;
    this.canEditCodezip = false;


  }

  isEditAddress() {
    this.canEditCodefirstname = false;
    this.canEditCodelastname = false;
    this.canEditCodeemail = false;
    this.canEditCodephone = false;
    this.canEditCodeaddress = true;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = false;
    this.canEditCodestate = false;
    this.canEditCodecountry = false;
    this.canEditCodezip = false;

  }

  isEditAddress2() {
    this.canEditCodefirstname = false;
    this.canEditCodelastname = false;
    this.canEditCodeemail = false;
    this.canEditCodephone = false;
    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = true;
    this.canEditCodecity = false;
    this.canEditCodestate = false;
    this.canEditCodecountry = false;
    this.canEditCodezip = false;

  }

  isEditCity() {
    this.canEditCodefirstname = false;
    this.canEditCodelastname = false;
    this.canEditCodeemail = false;
    this.canEditCodephone = false;
    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = true;
    this.canEditCodestate = false;
    this.canEditCodecountry = false;
    this.canEditCodezip = false;

  }

  isEditState() {
    this.canEditCodefirstname = false;
    this.canEditCodelastname = false;
    this.canEditCodeemail = false;
    this.canEditCodephone = false;
    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = false;
    this.canEditCodestate = true;
    this.canEditCodecountry = false;
    this.canEditCodezip = false;

  }
  isEditCountry() {
    this.canEditCodefirstname = false;
    this.canEditCodelastname = false;
    this.canEditCodeemail = false;
    this.canEditCodephone = false;
    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = false;
    this.canEditCodestate = false;
    this.canEditCodecountry = true;
    this.canEditCodezip = false;

  }

  isEditZip() {
    this.canEditCodefirstname = false;
    this.canEditCodelastname = false;
    this.canEditCodeemail = false;
    this.canEditCodephone = false;
    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = false;
    this.canEditCodestate = false;
    this.canEditCodecountry = false;
    this.canEditCodezip = true;



  }

  //   validateDuplicate(){
  //     this.sameNumerphoneNo = false;
  //    // console.log(this.educationForm);
  //    if(this.basicInfoFormObj.value.phoneNo == this.editedBasicInfoRecordData.phoneNo){
  //      this.sameNumerphoneNo = true;

  //    }

  //  }


  validateDuplicate(str: any) {
    //debugger
    if (str == 'resume-builder') {

      this.sameNumerphoneNo = false;


      this.dbmobileNocheck = (this.stuobj.NewphoneNo) ? this.stuobj.NewphoneNo : this.mobilenum;
      //this.dbStatus1 = this.dbStatus;  
      // console.log(this.dbmobileNocheck


      if ((this.basicInfoFormObjResumBuilder.value.phoneNo == this.dbmobileNocheck) && this.dbStatus) {
        this.sameNumerphoneNo = true;
        //this.stuobj.newdbstatus = ""
      } else {
        this.sameNumerphoneNo = false;
        // this.stuobj.newdbstatus = ""


      }
      // this.onBlurMethodResumBuilder();

    } else if (str == 'create-upload-resume') {

      this.sameNumerphoneNo = false;
      //var dbmobileNo = this.editedBasicInfoRecordData.phoneNo;
      // this.dbmobileNocheck = this.mobilenum;
      //  console.log(this.dbmobileNocheck);


      this.dbmobileNocheck = (this.stuobj.NewphoneNo) ? this.stuobj.NewphoneNo : this.mobilenum;
      //this.dbStatus1 = (this.stuobj.newdbstatus) ? this.stuobj.newdbstatus : this.dbStatus;  
      // console.log(this.dbmobileNocheck



      if ((this.basicInfoFormObj.value.phoneNo == this.dbmobileNocheck) && this.dbStatus) {
        this.sameNumerphoneNo = true;
        // this.stuobj.newdbstatus = ""
      } else {
        this.sameNumerphoneNo = false;
        //this.stuobj.newdbstatus = ""

      }
      // this.onBlurMethod();
    }


  }


  isEditVerifiedPhone(str: any) {
    //
    if (str == 'resume-builder') {
      this.verifiedPhone = false;
      // this.sameNumerphoneNo = true;
      // var dbmobileNo = this.editedBasicInfoRecordData.phoneNo;
      this.dbmobileNocheck = (this.stuobj.NewphoneNo) ? this.stuobj.NewphoneNo : this.mobilenum; // console.log(this.dbmobileNocheck
      //this.dbStatus = (this.stuobj.newdbstatus) ? this.stuobj.newdbstatus : f;     // console.log(this.dbmobileNocheck
      //this.dbStatus1 = (this.stuobj.newdbstatus) ? this.stuobj.newdbstatus : this.dbStatus; 

      if ((this.basicInfoFormObjResumBuilder.value.phoneNo == this.dbmobileNocheck) && this.dbStatus) {
        this.sameNumerphoneNo = true;
        // this.stuobj.newdbstatus = ""
      } else {
        this.sameNumerphoneNo = false;
        //this.stuobj.newdbstatus = ""
      }
      // this.onBlurMethodResumBuilder();

      // if(this.isResumeBuildeBasicinfopage) {
      //   var dbmobileNo1 = this.editedBasicInfoRecordData.phoneNo;
      //   this.dbmobileNocheck = this.auditlogService.decryptAES(dbmobileNo1);
      //   console.log(this.dbmobileNocheck);
      // }

      // if(this.basicInfoFormObjResumBuilder.value.phoneNo == this.dbmobileNocheck){

      // }
    } else if (str == 'create-upload-resume') {

      this.verifiedPhone = false;
      // this.sameNumerphoneNo = true;
      //var dbmobileNo = this.editedBasicInfoRecordData.phoneNo;
      //  this.dbmobileNocheck = this.mobilenum;
      //  console.log(this.dbmobileNocheck);

      this.dbmobileNocheck = (this.stuobj.NewphoneNo) ? this.stuobj.NewphoneNo : this.mobilenum; // console.log(this.dbmobileNocheck
      //this.dbStatus = (this.stuobj.newdbstatus) ? this.stuobj.newdbstatus : f;     // console.log(this.dbmobileNocheck
      //this.dbStatus1 = (this.stuobj.newdbstatus) ? this.stuobj.newdbstatus : this.dbStatus; 

      if ((this.basicInfoFormObj.value.phoneNo == this.dbmobileNocheck) && this.dbStatus) {
        this.sameNumerphoneNo = true;
        //this.stuobj.newdbstatus = ""
      } else {
        this.sameNumerphoneNo = false;
        this.stuobj.newdbstatus = ""

      }
      // this.onBlurMethod();


    }


  }


  onBlurMethodResumBuilder() {

    // this.canEditCodelastname = false

    console.log(this.basicInfoFormObjResumBuilder.value);


    //  return false;


    if (!this.basicInfoFormObjResumBuilder.valid) {
      return;
    }
    let touched = true;

    // this.basicInfoFormObj.value.verifiedPhone =  this.verifiedPhone;

    // if (this.basicInfoFormObjResumBuilder.status !== "VALID") {
    //   return;//"error";
    // }

    // let aryData = (Object.keys(this.basicInfoFormObjResumBuilder.controls));
    // for (let i = 0; i < aryData.length; i++) {

    //   if (!this.basicInfoFormObjResumBuilder.controls[(aryData[i])].touched) {
    //     touched = false;
    //     break;
    //   }
    // }
    console.log(this.basicInfoFormObjResumBuilder);
    if (this.basicInfoFormObjResumBuilder.valid) {
      console.log("touched all boxes>>>>");
      console.log(this.basicInfoFormObjResumBuilder.value)

      // this.basicInfoFormObjResumBuilder.value.verifiedPhone = this.sameNumerphoneNo; 

      if (this.verifiedPopUpStatus) {
        this.basicInfoFormObjResumBuilder.value.verifiedPhone = true;
      } else {

        if ((this.basicInfoFormObjResumBuilder.value.phoneNo == this.dbmobileNocheck)) {
          this.basicInfoFormObjResumBuilder.value.verifiedPhone = this.dbStatus;

        } else {
          this.basicInfoFormObjResumBuilder.value.verifiedPhone = false;
        }
      }

      if (localStorage.getItem('userId')) {
        let todo = {
          "userId": localStorage.getItem('userId'),
          "firstName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.firstName),
          "lastName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.lastName),
          "email": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.email),
          "phoneNo": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.phoneNo),
          "address": "",
          "apt": "",
          "cityName": "",
          "stateName": "",
          "countryName": "",
          "zipcode": "",
          "jobTitle": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.jobTitle),
          "isManual": 0,
          "userBasicID": 0,
          "verifiedPhone": this.basicInfoFormObjResumBuilder.value.verifiedPhone
        }

        // !this.isSmartyValid && !this.inSmartyValidation && 
        if (this.basicInfoFormObjResumBuilder.value.address && this.basicInfoFormObjResumBuilder.value.cityName && this.basicInfoFormObjResumBuilder.value.stateName && this.basicInfoFormObjResumBuilder.value.zipcode && !this.addressValid) {

          this.validateSmarty(false);
        } else {
          if (this.addressValid) {
            todo.address = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.address);
            todo.apt = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.apt);
            todo.cityName = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.cityName);
            todo.stateName = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.stateName);
            todo.countryName = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.countryName);
            todo.zipcode = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.zipcode);

          }

          // console.log(this.loginForm.value);
          this.staticAuditLogAPI('15', JSON.stringify(todo));
          this.userService.saveoreditbasicinformation(todo).subscribe((response) => {
            // this.listTodos();
            // this.isSmartyValid = false;
            this.dataToParent.emit({ name: 'basicInfo', candData: this.basicInfoFormObjResumBuilder.value });

            console.log(response);

            let obj = {
              "userId": localStorage.getItem('userId'),
              "jobTitle": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.jobTitle),
              "firstName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.firstName),
              "lastName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.lastName),
              "phoneNo": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.phoneNo),
              "email": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.email),
              "zipcode": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.zipcode),
              "countryName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.countryName),
              "stateName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.stateName),
              "cityName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.cityName),
              "address": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.address),
              "apt": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.apt),
              "userBasicID": response.userBasicID,
              "isManual": false,
              "isAccuick": false,
              "genderLookupID": 10003999,
              "accuickUserID": 0,
              "verifiedPhone": this.basicInfoFormObjResumBuilder.value.verifiedPhone

            }

            //this.basicInfoFormObjResumBuilder.value.verifiedPhone = this.sameNumerphoneNo;

            console.log(obj);




          }, (error => {

          }));

        }

      } else {

        this.selectedJob = JSON.parse(localStorage.getItem("jobData") || '{}');
        console.log(this.selectedJob.jobid);

        let todo = {
          "firstName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.firstName),
          "lastName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.lastName),
          "email": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.email),
          "phoneNo": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.phoneNo),
          "address": "",
          "apt": "",
          "cityName": "",
          "stateName": "",
          "countryName": "",
          "zipcode": "",
          "jobTitle": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.jobTitle),
          "isManual": 0,
          "verifiedPhone": this.basicInfoFormObjResumBuilder.value.verifiedPhone,
          "accuickJobId": (this.selectedJob.jobid) ? this.selectedJob.jobid : ''

        }
        // !this.isSmartyValid && !this.inSmartyValidation && 
        if (this.basicInfoFormObjResumBuilder.value.address && this.basicInfoFormObjResumBuilder.value.cityName && this.basicInfoFormObjResumBuilder.value.stateName && this.basicInfoFormObjResumBuilder.value.zipcode && !this.addressValid) {
          this.validateSmarty(false);
        } else {


          if (this.addressValid) {
            todo.address = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.address);
            todo.apt = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.apt);
            todo.cityName = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.cityName);
            todo.stateName = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.stateName);
            todo.countryName = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.countryName);
            todo.zipcode = this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.zipcode);

          }
          // console.log(this.loginForm.value);
          this.staticAuditLogAPI('15', JSON.stringify(todo));
          this.userService.apllyasgusetbasicinformation(todo).subscribe((response) => {
            // this.listTodos();
            console.log(">>>>>>>>" + response);
            if (response.body && response.body.Error) {
              this.toastr.error(response.body.Message);
              this.emailDataPass.emit("INVALID-EMAIL");
              return
            }
            // this.isSmartyValid = false;


            this.userService.setToken(response.headers.get('csn-auth-token'));
            this.userService.setUserId(response.body.userId);
            this.userService.setUserType(response.body.userType);
            localStorage.setItem('firstName', response.body.firstName);
            localStorage.setItem('lastName', response.body.lastName);
            localStorage.setItem('email', response.body.email);
            this.dataToParent.emit({ name: 'basicInfo', candData: this.basicInfoFormObjResumBuilder.value });

            let obj = {
              "userId": localStorage.getItem('userId'),

              "jobTitle": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.jobTitle),
              "firstName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.firstName),
              "lastName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.lastName),
              "phoneNo": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.phoneNo),
              "email": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.email),
              "zipcode": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.zipcode),
              "countryName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.countryName),
              "stateName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.stateName),
              "cityName": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.cityName),
              "address": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.address),
              "apt": this.auditlogService.encryptAES(this.basicInfoFormObjResumBuilder.value.apt),
              "userBasicID": response.userBasicID,
              "isManual": false,
              "isAccuick": false,
              "genderLookupID": 10003999,
              "accuickUserID": localStorage.getItem('userId'),
              "accuickJobId": (this.selectedJob.jobid) ? this.selectedJob.jobid : '',
              "verifiedPhone": this.basicInfoFormObjResumBuilder.value.verifiedPhone

            }

            //this.basicInfoFormObjResumBuilder.value.verifiedPhone = this.sameNumerphoneNo;

            console.log(obj);






          }, (error => {

          }));

        }



      }





    }





  }


  validateSmarty(type: any) {
    this.isSmartyValid = true;
    this.inSmartyValidation = true;
    this.addressValid = false;
    if (type) {

      this.userService.smartystreet(
        this.basicInfoFormObj.value.address,
        this.basicInfoFormObj.value.apt,
        this.basicInfoFormObj.value.cityName,
        this.basicInfoFormObj.value.stateName,
        this.basicInfoFormObj.value.zipcode
      ).subscribe((response) => {
        setTimeout(() => {
          this.inSmartyValidation = false;
        }, 1000);
        this.isSmartyValid = false;
        // console.clear();
        console.log('smartystreet');
        console.log(response);
        if (response.length && response[0].analysis) {
          if (response[0].analysis.footnotes == "B#") {
            this.toastr.error('Please enter valid State');
          } else if (response[0].analysis.footnotes == "V#") {
            this.toastr.error('Please enter valid City');
          } else if (response[0].analysis.dpv_footnotes == "AABB") {
            this.addressValid = true;
            this.onBlurMethod();
            this.isSmartyValid = true;
            // alert('Address Valid');
          } else if (response[0].analysis.dpv_footnotes == "A1M1") {
            this.toastr.error('Please enter valid Address');
          } else if (response[0].analysis.dpv_footnotes == "AAN1" || response[0].analysis.dpv_footnotes.includes("CC")) {
            this.toastr.error('Please enter valid Apt Suite No');
          } else if (0) {
            this.toastr.error('Please enter valid Apt Suite No');
          } else {
            this.addressValid = true;
            this.onBlurMethod();
            this.isSmartyValid = true;
            // alert('Address Valid');
          }

        } else if (!response.length) {
          console.log("response.lengthhh", response.length)
          this.toastr.error('Entered Address is Invalid');

        } else {
          this.addressValid = true;
          this.onBlurMethod();
          this.isSmartyValid = true;
        }


      }, (error => {
        console.log('error : ' + error)
        this.onBlurMethod();
      }));

    } else {
      this.userService.smartystreet(
        this.basicInfoFormObjResumBuilder.value.address,
        this.basicInfoFormObjResumBuilder.value.apt,
        this.basicInfoFormObjResumBuilder.value.cityName,
        this.basicInfoFormObjResumBuilder.value.stateName,
        this.basicInfoFormObjResumBuilder.value.zipcode
      ).subscribe((response) => {
        setTimeout(() => {
          this.inSmartyValidation = false;
        }, 1000);
        this.isSmartyValid = false;
        // console.clear();
        console.log('smartystreet');
        console.log(response);
        if (response.length && response[0].analysis) {
          if (response[0].analysis.footnotes == "B#") {
            this.toastr.error('Please enter valid State');
          } else if (response[0].analysis.footnotes == "V#") {
            this.toastr.error('Please enter valid City');
          } else if (response[0].analysis.dpv_footnotes == "AABB") {
            this.addressValid = true;
            this.onBlurMethodResumBuilder();
            this.isSmartyValid = true;
            // alert('Address Valid');
          } else if (response[0].analysis.dpv_footnotes == "A1M1") {
            this.toastr.error('Please enter valid Address');
          } else if (response[0].analysis.dpv_footnotes == "AAN1" || response[0].analysis.dpv_footnotes.includes("CC")) {
            this.toastr.error('Please enter valid Apt Suite No');
          } else if (0) {
            this.toastr.error('Please enter valid Apt Suite No');
          } else {
            this.addressValid = true;
            this.onBlurMethodResumBuilder();
            this.isSmartyValid = true;
            // alert('Address Valid');
          }

        } else if (!response.length) {
          console.log("response.lengthhhh", response.length)
          this.toastr.error('Entered Address is Invalid');

        } else {
          this.onBlurMethodResumBuilder();
          this.isSmartyValid = true;
        }


      }, (error => {
        console.log('error : ' + error)
        this.onBlurMethodResumBuilder();
      }));
    }


  }


  onBlurMethod() {



    // this.canEditCodelastname = false
    //
    console.log(this.basicInfoFormObj.value);

    let touched = true;
    if (this.basicInfoFormObj.status !== "VALID") {
      return; //"error";
    }
    if (!this.basicInfoFormObj.valid) {
      return;
    }
    this.canEditCodefirstname = false;
    this.canEditCodelastname = false;
    this.canEditCodeemail = false;
    this.canEditCodephone = false;


    this.canEditCodeaddress = false;
    this.canEditCodeaddress2 = false;
    this.canEditCodecity = false;
    this.canEditCodestate = false;
    this.canEditCodecountry = false;
    this.canEditCodezip = false;


    if (this.basicInfoFormObj.valid) {
      // console.log("touched all boxes>>>>");
      console.log(this.basicInfoFormObj.value)
      // 
      //this.basicInfoFormObj.value.verifiedPhone = this.sameNumerphoneNo;  

      if (this.verifiedPopUpStatus) {
        this.basicInfoFormObj.value.verifiedPhone = true;
      } else {

        //debugger;
        if ((this.basicInfoFormObj.value.phoneNo == this.dbmobileNocheck)) {
          this.basicInfoFormObj.value.verifiedPhone = this.dbStatus;

        } else {
          this.basicInfoFormObj.value.verifiedPhone = false;
        }
      }

      let todo = {
        "userId": localStorage.getItem('userId'),
        "firstName": this.auditlogService.encryptAES(this.basicInfoFormObj.value.firstName),
        "lastName": this.auditlogService.encryptAES(this.basicInfoFormObj.value.lastName),
        "email": this.auditlogService.encryptAES(this.basicInfoFormObj.value.email),
        "phoneNo": this.auditlogService.encryptAES(this.basicInfoFormObj.value.phoneNo),
        "address": "",
        "apt": "",
        "cityName": "",
        "stateName": "",
        "countryName": "",
        "zipcode": "",
        "jobTitle": this.auditlogService.encryptAES(this.basicInfoFormObj.value.jobTitle),
        "isManual": 0,
        "userBasicID": 0,
        "verifiedPhone": this.basicInfoFormObj.value.verifiedPhone

      }

      if (this.editedBasicInfoRecordData) {
        todo.userBasicID = this.editedBasicInfoRecordData.userBasicID;
        // this.verifiedPhone = this.editedBasicInfoRecordData.verifiedPhone;
      }

      // !this.isSmartyValid && !this.inSmartyValidation && 
      if (this.basicInfoFormObj.value.address && this.basicInfoFormObj.value.cityName && this.basicInfoFormObj.value.stateName && this.basicInfoFormObj.value.zipcode && !this.addressValid) {
        this.validateSmarty(true);
      } else {

        if (this.addressValid) {
          todo.address = this.auditlogService.encryptAES(this.basicInfoFormObj.value.address);
          todo.apt = this.auditlogService.encryptAES(this.basicInfoFormObj.value.apt);
          todo.cityName = this.auditlogService.encryptAES(this.basicInfoFormObj.value.cityName);
          todo.stateName = this.auditlogService.encryptAES(this.basicInfoFormObj.value.stateName);
          todo.countryName = this.auditlogService.encryptAES(this.basicInfoFormObj.value.countryName);
          todo.zipcode = this.auditlogService.encryptAES(this.basicInfoFormObj.value.zipcode);

        }
        // 
        // console.log(this.loginForm.value);
        this.staticAuditLogAPI('15', JSON.stringify(todo));
        //return;
        this.userService.saveoreditbasicinformation(todo).subscribe((response) => {
          // this.listTodos();
          //this.isSmartyValid = false;
          this.dataToParent.emit({ name: 'basicInfo', candData: this.basicInfoFormObj.value });
          console.log(response);
          let obj = {
            "userId": localStorage.getItem('userId'),
            "jobTitle": this.auditlogService.encryptAES(this.basicInfoFormObj.value.jobTitle),
            "firstName": this.auditlogService.encryptAES(this.basicInfoFormObj.value.firstName),
            "lastName": this.auditlogService.encryptAES(this.basicInfoFormObj.value.lastName),
            "phoneNo": this.auditlogService.encryptAES(this.basicInfoFormObj.value.phoneNo),
            "email": this.auditlogService.encryptAES(this.basicInfoFormObj.value.email),
            "zipcode": this.auditlogService.encryptAES(this.basicInfoFormObj.value.zipcode),
            "countryName": this.auditlogService.encryptAES(this.basicInfoFormObj.value.countryName),
            "stateName": this.auditlogService.encryptAES(this.basicInfoFormObj.value.stateName),
            "cityName": this.auditlogService.encryptAES(this.basicInfoFormObj.value.cityName),
            "address": this.auditlogService.encryptAES(this.basicInfoFormObj.value.address),
            "apt": this.auditlogService.encryptAES(this.basicInfoFormObj.value.apt),
            "userBasicID": response.userBasicID,
            "isManual": false,
            "isAccuick": false,
            "genderLookupID": 10003999,
            "accuickUserID": 0,
            'verifiedPhone': this.basicInfoFormObj.value.verifiedPhone


          }

          //this.basicInfoFormObj.value.verifiedPhone = this.sameNumerphoneNo;
          // userEmploymentId



          //  if(this.editedBasicInfoRecordData){
          //    this.editBasicInfo.emit(obj);
          //  } else {
          //  this.addBasicInfo.emit(obj);
          //  }

        }, (error => {

        }));

      } // else


    }




  }

  decryptIt(input: any) {
    return this.auditlogService.decryptAES(input);
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


  SaveVerifiedPhoneNumber(obj: any) {
    // 

    if (localStorage.getItem('userId')) {

      let todo1 = {
        "userId": localStorage.getItem('userId'),
        "firstName": this.auditlogService.encryptAES(obj.value.firstName),
        "lastName": this.auditlogService.encryptAES(obj.value.lastName),
        "email": this.auditlogService.encryptAES(obj.value.email),
        "phoneNo": this.auditlogService.encryptAES(obj.value.phoneNo),
        "zipcode": this.auditlogService.encryptAES(obj.value.zipcode),
        "countryName": this.auditlogService.encryptAES(obj.value.countryName),
        "stateName": this.auditlogService.encryptAES(obj.value.stateName),
        "cityName": this.auditlogService.encryptAES(obj.value.cityName),
        "jobTitle": this.auditlogService.encryptAES(obj.value.jobTitle),
        "address": this.auditlogService.encryptAES(obj.value.address),
        "apt": this.auditlogService.encryptAES(obj.value.apt),
        "isManual": 0,
        "userBasicID": 0,
        "verifiedPhone": obj.value.verifiedPhone

      }

      //this.showSpinner = true;
      this.userService.saveoreditbasicinformation(todo1).subscribe((response) => {
        // this.listTodos();
        this.dataToParent.emit({ name: 'basicInfo', candData: obj.value });
        console.log(response);
        // this.showSpinner = false;
        this.stuobj = {
          "NewphoneNo": obj.value.phoneNo,
          "newdbstatus": "true"
        }

        console.log(this.stuobj)

      }, (error => {

      }));

    }



  }



  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }



  openVerifyMobileModal(str: any) {
    // 
    if (localStorage.getItem('userId')) {
      if (str == "resume-builder") {
        if (!this.basicInfoFormObjResumBuilder.controls.phoneNo.value) {
          return;
        }
        this.datapassPhoneNo = this.basicInfoFormObjResumBuilder.value.phoneNo

      }
      if (str == "create-upload-resume") {

        if (!this.basicInfoFormObj.controls.phoneNo.value) {
          return;
        }
        this.datapassPhoneNo = this.basicInfoFormObj.value.phoneNo
      }

      let dialogRef = this.dialog.open(EditVerifyMobileNumberComponent, {
        // height: 'calc(100% - 280px)',
        // width: 'calc(100% - 800px)',
        maxWidth: "850px",
        data: { phone: this.datapassPhoneNo, modalPopup: '1' },
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        this.resultSendVefirifactinCode = dialogResult;
        if (this.resultSendVefirifactinCode) {
          // this.toastr.success(this.resultSendVefirifactinCode.Message);
          if (str == "resume-builder") {

            this.basicInfoFormObjResumBuilder.patchValue({
              phoneNo: this.resultSendVefirifactinCode.newmobileno
            });

            this.verifiedPhone = true;
            this.verifiedPopUpStatus = true;
            this.basicInfoFormObjResumBuilder.value.verifiedPhone = this.verifiedPhone;
            console.log(this.basicInfoFormObjResumBuilder.value);
            this.SaveVerifiedPhoneNumber(this.basicInfoFormObjResumBuilder);

          } else if (str == "create-upload-resume") {
            this.basicInfoFormObj.patchValue({
              phoneNo: this.resultSendVefirifactinCode.newmobileno
            });

            this.verifiedPhone = true;
            this.verifiedPopUpStatus = true;
            this.basicInfoFormObj.value.verifiedPhone = this.verifiedPhone;;
            console.log(this.basicInfoFormObj.value);
            // debugger;
            this.SaveVerifiedPhoneNumber(this.basicInfoFormObj);

          }

        }
      }); //
    }



  }


}
