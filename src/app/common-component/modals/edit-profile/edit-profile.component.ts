import { Component, OnInit, Inject, Output, EventEmitter, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UserAuthService } from 'src/app/user-auth.service';
import { EditVerifyMobileNumberComponent } from '../edit-verify-mobile-number/edit-verify-mobile-number.component';

import { environment } from '../../../../environments/environment';

import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatValidateAddressDirective } from '@angular-material-extensions/google-maps-autocomplete';
import { debug } from 'console';



@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  educationForm: FormGroup;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  verifiedPhone: any;
  datapassPhoneNo: any;
  resultSendVefirifactinCode: any;

  options: any = [];
  addressValid = false;

  searchOption: any;
  @ViewChild('search') search: ElementRef | undefined;
  // @ViewChild('search1') search1: ElementRef | undefined;

  private onNewPlaceResult: EventEmitter<any> = new EventEmitter();
  private addressValidator: MatValidateAddressDirective = new MatValidateAddressDirective();

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditlogService: AuditlogService,
    private userService: UserAuthService,
    private toastr: ToastrService
  ) {
    this.educationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      email: ['', Validators.required],
      phoneNo: [''],
      cityName: [''],
      stateName: [''],
      countryName: [''],
      zipcode: [''],
      address: [''],
      apt: [''],
      userId: [localStorage.getItem('userId')],
      isManual: [1]
    });
  }
  showSpinner = false;
  // accuickUserID: 0
  // cityName: "lPX/r45u3gpm0J7V1uRbxw==\r\n"
  // countryName: "agxaJNW7s7ZnnaCfEfAbug==\r\n"
  // email: "GkggQdhLV/Q9rogzdY25SohVBlPypkiEB35KNrv5FrM=\r\n"
  // firstName: "gxEwYivtRVh7Or9KSu3uVg==\r\n"
  // genderLookupID: 10003999
  // isAccuick: false
  // jobTitle: ""
  // lastName: "3itxYH8UMTLRtcUQ3TXqFQ==\r\n"
  // modifiedDateTime: "2021-09-30 13:29:45.0"
  // phoneNo: "vSf7qz/ib9gBsHWKeYY9dA==\r\n"
  // stateName: "sJCUEhAMtRESoflviBL0Fg==\r\n"
  // userBasicID: 20
  // userID: 34
  // zipcode: "EA5KCEeQGE5V5loiDp83cA==\r\n"
  candData: any;
  candPage: any;
  dataToPass: any;
  isSmartyValid = false;
  inSmartyValidation = false;
  verifiedPopUpStatus = false;
  dbStatus = false;

  sameNumerphoneNo: any;

  validateSmarty(str: any) {
    this.isSmartyValid = true;
    this.inSmartyValidation = true;
    this.showSpinner = true;
    this.addressValid = false;
    this.userService.smartystreet(
      this.educationForm.value.address,
      this.educationForm.value.apt,
      this.educationForm.value.cityName,
      this.educationForm.value.stateName,
      this.educationForm.value.zipcode
    ).subscribe((response) => {
      setTimeout(() => {
        this.inSmartyValidation = false;
      }, 1000);
      this.isSmartyValid = false;
      // console.clear();
      console.log('smartystreet');
      console.log(response);
      this.showSpinner = false;
      if (response.length && response[0].analysis) {
        if (response[0].analysis.footnotes == "B#") {
          this.toastr.error('Please enter valid State');
        } else if (response[0].analysis.footnotes == "V#") {
          this.toastr.error('Please enter valid City');
        } else if (response[0].analysis.dpv_footnotes == "AABB") {
          this.addressValid = true;
          this.update(str);
          this.isSmartyValid = true;
          // alert('Address Valid');
        } else if (response[0].analysis.dpv_footnotes == "A1M1") {
          this.toastr.error('Please enter valid Address');
        } else if (response[0].analysis.dpv_footnotes == "AAN1" || response[0].analysis.dpv_footnotes.includes("CC")) {
          this.toastr.error('Please enter valid Apt Suite No');
        } else if (0) {
          this.toastr.error('Please enter valid Apt Suite No');
        } else {
          this.isSmartyValid = true;
          this.addressValid = true;
          this.update(str);
          // alert('Address Valid');
        }

      } else if (!response.length) {
        console.log("response.lengthh", response.length)
        this.toastr.error('Entered Address is Invalid');

      } else {
        this.addressValid = true;
        this.update(str);
        this.isSmartyValid = true;
      }


    }, (error => {
      console.log('error : ' + error);
      this.showSpinner = false;
      // this.update(str);
    }));
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

  update(str: any) {
    debugger
    if (this.educationForm.valid) {

      // if(this.educationForm.value.phoneNo == this.candData.phoneNo){
      //   this.educationForm.value.verifiedPhone = true;
      // }else{
      //   this.educationForm.value.verifiedPhone = false;
      // }

      // debugger;
      // this.educationForm.value.verifiedPhone = this.verifiedPopUpStatus;   

      if (this.verifiedPopUpStatus) {
        this.educationForm.value.verifiedPhone = true;
      } else {

        if ((this.educationForm.value.phoneNo == this.candData.phoneNo)) {
          this.educationForm.value.verifiedPhone = this.dbStatus;

        } else {
          this.educationForm.value.verifiedPhone = false;
        }
      }

      // this.verifiedPopUpStatus

      this.dataToPass = {
        "userId": localStorage.getItem('userId'),
        "firstName": this.auditlogService.encryptAES(this.educationForm.value.firstName),
        "lastName": this.auditlogService.encryptAES(this.educationForm.value.lastName),
        "email": this.auditlogService.encryptAES(this.educationForm.value.email),
        "phoneNo": this.auditlogService.encryptAES(this.educationForm.value.phoneNo),
        "zipcode": this.auditlogService.encryptAES(this.educationForm.value.zipcode),
        "cityName": this.auditlogService.encryptAES(this.educationForm.value.cityName),
        "stateName": this.auditlogService.encryptAES(this.educationForm.value.stateName),
        "countryName": this.auditlogService.encryptAES(this.educationForm.value.countryName),
        "jobTitle": this.auditlogService.encryptAES(this.educationForm.value.jobTitle),
        "address": this.auditlogService.encryptAES(this.educationForm.value.address),
        "apt": this.auditlogService.encryptAES(this.educationForm.value.apt),
        "verifiedPhone": this.educationForm.value.verifiedPhone,
        "isManual": 0

      }
      if (this.educationForm.value.address.trim() && this.educationForm.value.cityName.trim() && this.educationForm.value.stateName.trim() && this.educationForm.value.zipcode.trim() && !this.addressValid) {
        this.validateSmarty(str);
      } else {
        this.showSpinner = true;
        if (this.candPage == '1') {
          this.staticAuditLogAPI('84', JSON.stringify(this.dataToPass));
        }
        if (this.candPage == '2') {
          this.staticAuditLogAPI('93', JSON.stringify(this.dataToPass));
        }


        // this.educationForm.value.verifiedPhone = this.verifiedPhone; 


        this.userService.saveoreditbasicinformation(this.dataToPass).subscribe((response) => {
          console.log(response);
          this.showSpinner = false;
          if (response && response.Status == 401) {
            this.toastr.error(response.Message);
          }
          if (response && response.Success) {
            // debugger;
            if (str == 'formbtn') {
              // this.toastr.success(response.Message);
              // this.educationForm.value.verifiedPhone = this.sameNumerphoneNo;
              this.dialogRef.close(this.educationForm.value);
            }

            //this.staticAuditLogAPI('85', '');
            if (this.candPage == '1') {
              this.staticAuditLogAPI('85', '');
            }
            if (this.candPage == '2') {
              this.staticAuditLogAPI('94', '');
            }
          }
        }, (error => {

        }));
      } //else
    }
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  SaveVerifiedPhoneNumber(obj: any) {
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

  ngOnInit(): void {
    this.candPage = this.data.candPage;
    this.candData = this.data.candData;
    this.dbStatus = this.data.candData.verifiedPhone;
    this.verifiedPhone = this.data.candData.verifiedPhone;
    console.log(">>>>>>>>>>>>>>>>>>>" + this.verifiedPhone);

    var mobilenum = this.candData.phoneNo;
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
      firstName: this.candData.firstName,
      lastName: this.candData.lastName,
      jobTitle: this.candData.jobTitle,
      email: this.candData.email,
      phoneNo: mobilenum,
      cityName: this.candData.cityName,
      stateName: this.candData.stateName,
      countryName: this.candData.countryName,
      zipcode: this.candData.zipcode,
      address: this.candData.address,
      apt: this.candData.apt,
      userId: localStorage.getItem('userId'),
      isManual: 1
    });
  }

  onClose(): void {
    // Close the dialog, return false
    if (this.candPage == '1') {
      this.staticAuditLogAPI('85', '');
    }
    if (this.candPage == '2') {
      this.staticAuditLogAPI('94', '');
    }
    if (this.candPage == '3') {
      this.staticAuditLogAPI('85', '');
    }

    this.dialogRef.close(false);
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



  placeSelected(event: any, trigger: MatAutocompleteTrigger, data: any, formtype: any) {

    if (data.data.entries > 1) {
      this.options = [];

      this.educationForm.patchValue({
        address: data.name,
      });

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


      this.educationForm.patchValue({
        address: data.data.street_line,
        apt: data.data.secondary,
        cityName: data.data.city,
        stateName: data.data.state,
        countryName: "USA",
        zipcode: data.data.zipcode
      });
      // this.update('formbtn')
    }

  }


  onAutocompleteSelected(res: any) {
    this.options = [];

    let queryParam = "";
    queryParam = "key=" + environment.smartyKey + "&search=" + (this.educationForm.value.address) + "&selected=&source=all";

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

  onAutocompleteSelectedbackup(res: any) {
    this.addressValidator.subscribe(this.onNewPlaceResult);
    // this.canEditCodezip = false;
    // this.canEditCodecountry = false;
    // this.canEditCodestate = false;
    // this.canEditCodecity = false;
    this.searchOption = this.search?.nativeElement

    const autocomplete = new google.maps.places.Autocomplete(this.searchOption, {
      componentRestrictions: { country: ["us", "ca"] },
      fields: ["address_components", "geometry"],
      types: ["address"],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const germanAddress = {
        streetNumber: '',
        streetName: '',
        postalCode: '',
        sublocality: '',
        locality: { long: '', short: '' },
        state: { long: '', short: '' },
        country: { long: '', short: '' }
      };

      if (place.address_components) {
        console.log(place);
        console.log(place.address_components);
        place.address_components.forEach(value => {
          if (value.types.indexOf('street_number') > -1) {
            germanAddress.streetNumber = value.short_name;
          }
          if (value.types.indexOf('route') > -1) {
            germanAddress.streetName = value.long_name;
          }
          if (value.types.indexOf('postal_code') > -1) {
            germanAddress.postalCode = value.short_name;
          }
          if (value.types.indexOf('sublocality') > -1) {
            germanAddress.sublocality = value.long_name;
          }
          if ((value.types.indexOf('locality') > -1) || (value.types.indexOf('administrative_area_level_3') > -1)) {
            germanAddress.locality.long = value.long_name;
            germanAddress.locality.short = value.short_name;
          }
          if (value.types.indexOf('administrative_area_level_1') > -1) {
            germanAddress.state.long = value.long_name;
            germanAddress.state.short = value.short_name;
          }
          if (value.types.indexOf('country') > -1) {
            germanAddress.country.long = value.long_name;
            germanAddress.country.short = value.short_name;
          }
          // if (value.types.indexOf('administrative_area_level_3') > -1) {
          //   germanAddress.locality.short = value.short_name;
          // }
        });



        //     this.basicInfoFormObjResumBuilder.patchValue({
        //   address:  germanAddress.streetNumber + " " + germanAddress.streetName,
        //   cityName:  germanAddress.locality.long,
        //   stateName:  germanAddress.state.long,
        //   countryName:  germanAddress.country.long,
        //   zipcode: germanAddress.postalCode
        // });
        // this.canEditCodezip = true;
        // this.canEditCodecountry = true;
        // this.canEditCodestate = true;
        // this.canEditCodecity = true;
        //this.updateRstresumBuilder()

      }

      this.educationForm.patchValue({
        address: germanAddress.streetNumber + " " + germanAddress.streetName,
        cityName: germanAddress.locality.long,
        stateName: germanAddress.state.long,
        countryName: germanAddress.country.long,
        zipcode: germanAddress.postalCode
      });
      // this.canEditCodezip = true;
      // this.canEditCodecountry = true;
      // this.canEditCodestate = true;
      // this.canEditCodecity = true;
      //this.updateRstresumBuilder()

    });
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

}
