import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { UserAuthService } from '../user-auth.service';
import { UserAuthService } from 'src/app/user-auth.service';
import { AuditlogService } from '../shared/auditlog.service';
import { HtmlConvertionService } from '../shared/services/html-convertion.service';
import { Router } from '@angular/router';
import { Emitters } from '../class/emitters/emitters';
import { AssessmentCountService } from '../shared/services/assessment-count.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {


  curEmpStatus: any;
  categoryList: any;
  curEmpStatusList: any;
  availabilityList: any;
  employmentPreferenceList: any;
  flexibilityPreferenceList: any;
  relocationPreferenceList: any;
  milesList: any;
  milesRoleList: any;
  travelPercentageList: any;
  // employmentPreferenceList:any;
  legalStatus = 0;
  visaSponsorStatus: any;
  showSpinner = false;

  formObj = {
    "userAdditionID": 0,
    "empStatusLookupID": 0,
    "empAvailLookupID": 0,
    "empPrefLookupID": 0,
    "empFlexLookupID": 0,
    "empYearCompensation": 0,
    "empHourCompensation": 0,
    "empCompThreshhold": 1,
    "empTravelMilesLookupID": 0,
    "empTravelPerTimeLookupID": 0,
    "empRelocPrefLookupID": 0,
    "empPrefRoleTitle": "",
    "empPrefLocation": "",
    "empRoleMilesLookupID": 0,
    "legalStatus": 0,
    "visaSponsorStatus": 0

  };
  roleForm: FormGroup;
  masterLanguagesList: any = [];
  masterLanguagesListLoaded = false;
  reviewdetailsLoaded = false;

  candData = {
    name: '',
    location: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phoneNo: '',
    cityName: '',
    stateName: '',
    countryName: '',
    zipcode: '',
    careersummary: '',
    empHistory: [],
    education: [],
    skills: [],
    socialsLinks: [],
    languages: [],
    certficationList: [],
    trainingList: [{
      trainValue: '',
      trainingName: '',
      completedYear: '',
      institutionName: ''
    }],
    currEmpStatus: '',
    availability: '',
    empPerf: '',
    flexibilityPref: '',
    compensationPref: '',
    travelPrefPercent: '',
    travelPrefMiles: '',
    relocationPref: '',
    legalUS: '',
    requireVisa: '',
    payRate: '',
    payType: '',
    empHourCompensation: '',
    empPrefLocation: '',
    empPrefRoleTitle: '',
    miles: ''
  };
  useridToPass = localStorage.getItem('userId');
  authToken = localStorage.getItem('userToken');
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  constructor(
    private auditlogService: AuditlogService,
    private formBuilder: FormBuilder,
    private userService: UserAuthService,
    private toastr: ToastrService,
    private router: Router,
    private htmlConvert: HtmlConvertionService,
    private countChange: AssessmentCountService
  ) {
    this.roleForm = this.formBuilder.group({
      preferredRoleTitle: [''],
      preferredLocation: [''],
      roleMiles: ['']
    });


    // console.log(this.userService.categoryList);
  }

  setcurEmpStatus(type: any) {
    this.formObj.empStatusLookupID = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('68', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }

  setAvailability(type: any) {

    this.formObj.empAvailLookupID = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('69', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }

  setEmpPref(type: any) {
    this.formObj.empPrefLookupID = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('70', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }

  setEmpPrefFlex(type: any) {
    this.formObj.empFlexLookupID = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('71', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }

  setempYearCompensation() {
    // this.formObj.empFlexLookupID = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('72', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }

  setempTravelMilesLookupID() {
    // this.formObj.visaSponsorStatus = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('73', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }

  setRelocationPref(type: any) {

    this.formObj.empRelocPrefLookupID = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('74', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }

  setRolePrefences() {
    // this.formObj.visaSponsorStatus = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('75', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }

  setLegalStatus(type: any) {
    this.formObj.legalStatus = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('76', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }
  setVisaSponsorStatus(type: any) {
    this.formObj.visaSponsorStatus = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('77', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }

  setempCompThreshhold(type: any) {
    // this.formObj.visaSponsorStatus = type;
    let jsonDataobj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.staticAuditLogAPI('131', JSON.stringify(jsonDataobj));
    this.savePrefences();
  }
  preferenceSave() {


    if (localStorage.getItem("pageFrom") == 'accuick' && localStorage.getItem('jobData')) {
      this.router.navigate(['/thanks-for-applying']);
      return;
    } else {
      this.staticAuditLogAPI('78', '');
      this.router.navigate(['/dashboard']);

      var s = localStorage.getItem("locationfromCreateUploadResume");
      if (s === null) {
        console.log("is null"); //does not enter here
      } else {
        //console.log(s); // prints [object *O*bject]
        localStorage.removeItem("locationfromCreateUploadResume")
      }






    }
  }




  savePrefences() {
    let obj = {
      "userId": localStorage.getItem('userId'),
      "userAdditionID": this.formObj.userAdditionID,
      "empStatusLookupID": this.formObj.empStatusLookupID,
      "empAvailLookupID": this.formObj.empAvailLookupID,
      "empPrefLookupID": this.formObj.empPrefLookupID,
      "empFlexLookupID": this.formObj.empFlexLookupID,
      "empYearCompensation": this.formObj.empYearCompensation,
      "empHourCompensation": this.formObj.empHourCompensation,
      "empCompThreshhold": this.formObj.empCompThreshhold,
      "empTravelMilesLookupID": this.formObj.empTravelMilesLookupID,
      "empTravelPerTimeLookupID": this.formObj.empTravelPerTimeLookupID,
      "empRelocPrefLookupID": this.formObj.empRelocPrefLookupID,
      "empPrefRoleTitle": this.roleForm.value.preferredRoleTitle,
      "empPrefLocation": this.roleForm.value.preferredLocation,
      "empRoleMilesLookupID": this.roleForm.value.roleMiles,
      "legalStatus": this.formObj.legalStatus,
      "visaSponsorStatus": this.formObj.visaSponsorStatus
    }
    this.userService.saveoreditpreferencedetails(obj).subscribe((response) => {
      // this.listTodos();
      if (response.Success) {
        this.formObj.userAdditionID = response.userAdditionID;
        this.loadPrefValues(obj);
      }
    }, (error => {

    }));
  }
  saveHtml() {
    if (this.candData.firstName.trim() && this.candData.lastName.trim() && this.candData.email.trim()) {
      // alert('save Profile Called');
      let dataToPass = {
        "userId": this.useridToPass,
        "htmlbody": this.htmlConvert.loadData(this.candData)
      }
      this.userService.saveHtml(dataToPass, this.authToken).
        subscribe((response: any) => {
          this.showSpinner = false;
          if (response && response.Status) {
            console.log(response);
          }

        }, (error => {

        }));
    }
  }

  getcategorylist() {
    this.showSpinner = true;
    // console.log(this.loginForm.value);
    this.userService.getcategorylist().subscribe((response: any) => {
      if (response && response.Success) {
        this.userService.categoryList = response.CategoryList;
        this.getIndividualObject();
      }
    }, (error => {

    }));
  }
  getPreferences() {
    this.showSpinner = true;
    this.userService.getPreferences().subscribe((response: any) => {
      this.showSpinner = false;
      if (response && response.Success) {
        if ((response.preferenceList && response.preferenceList.length)) {
          this.formObj = response.preferenceList[0];
          this.roleForm.controls.preferredRoleTitle.setValue(response.preferenceList[0].empPrefRoleTitle);
          this.roleForm.controls.preferredLocation.setValue(response.preferenceList[0].empPrefLocation);
          this.milesRoleList.forEach((element: { lookupValue: any; lookupId: any; }) => {
            if (element.lookupId == response.preferenceList[0].empRoleMilesLookupID) {
              this.roleForm.controls.roleMiles.setValue(element.lookupId);
            }
          });
          this.loadPrefValues(response.preferenceList[0]);

        }
      }

    }, (error => {

    }));
  }
  loadPrefValues(response: any) {

    let milesListObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10014;
    });
    if (milesListObj && milesListObj.length) {
      milesListObj[0].lookupsList.forEach((element: { lookupValue: any; lookupId: any; }) => {
        if (element.lookupId == response.empRoleMilesLookupID) {
          // this.roleForm.controls.roleMiles.setValue(element.lookupId);
        }
      });
    }
    this.candData.empHourCompensation = response.empHourCompensation;
    this.candData.empPrefLocation = response.empPrefLocation;
    this.candData.empPrefRoleTitle = response.empPrefRoleTitle;

    this.candData.requireVisa = response.visaSponsorStatus;
    this.candData.legalUS = response.legalStatus;
    this.candData.compensationPref = response.empYearCompensation;

   /***************** Yes-no  */

  this.candData.legalUS = (this.candData.legalUS == "1") ? 'Yes' : (this.candData.legalUS == "2") ? 'No' : '';
  this.candData.requireVisa = (this.candData.requireVisa == "1") ? 'Yes' : (this.candData.requireVisa == "2") ? 'No' : '';
  
  this.candData.compensationPref = (this.candData.compensationPref) ? (this.candData.compensationPref) : '';
  this.candData.empHourCompensation = (this.candData.empHourCompensation) ? (this.candData.empHourCompensation) : '';

  
    let availObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10011;
    });
    let availTempObj = availObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == response.empAvailLookupID;
    });
    this.candData.availability = (availTempObj.length) ? availTempObj[0].lookupValue : '';

    let flexObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10013;
    });
    let flexTempObj = flexObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == response.empFlexLookupID;
    });
    this.candData.flexibilityPref = (flexTempObj.length) ? flexTempObj[0].lookupValue : '';

    let prefObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10012;
    });
    let prefTempObj = prefObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == response.empPrefLookupID;
    });
    this.candData.empPerf = (prefTempObj.length) ? prefTempObj[0].lookupValue : '';

    let relocationPrefObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10016;
    });
    let relocationPrefTempObj = relocationPrefObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == response.empRelocPrefLookupID;
    });
    this.candData.relocationPref = (relocationPrefTempObj.length) ? relocationPrefTempObj[0].lookupValue : '';

    let roleMilesObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10017;
    });
    let roleMilesTempObj = roleMilesObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == response.empRoleMilesLookupID;
    });
    this.candData.miles = (roleMilesTempObj.length) ? roleMilesTempObj[0].lookupValue : '';

    let empStatusObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10010;
    });
    let empStatusTempObj = empStatusObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == response.empStatusLookupID;
    });
    this.candData.currEmpStatus = (empStatusTempObj.length) ? empStatusTempObj[0].lookupValue : '';


    let travelPerObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10015;
    });
    let travelPerTempObj = travelPerObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == response.empTravelPerTimeLookupID;
    });
    this.candData.travelPrefPercent = (travelPerTempObj.length) ? travelPerTempObj[0].lookupValue : '';

    let travelMilesObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10014;
    });
    let travelMilesTempObj = travelMilesObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == response.empTravelMilesLookupID;
    });
    this.candData.travelPrefMiles = (travelMilesTempObj.length) ? travelMilesTempObj[0].lookupValue : '';

    console.log('HTML Completed');
    console.log(this.candData);
  }

  getIndividualObject() {

    // cur emp status obj
    let curEmpStatusobj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10010;
    });
    this.curEmpStatusList = (curEmpStatusobj && curEmpStatusobj.length) ? curEmpStatusobj[0].lookupsList : [];

    // cur emp status obj
    let availabilityobj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10011;
    });
    this.availabilityList = (availabilityobj && availabilityobj.length) ? availabilityobj[0].lookupsList : [];


    // cur emp status obj
    let empPrefobj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10012;
    });
    this.employmentPreferenceList = (empPrefobj && empPrefobj.length) ? empPrefobj[0].lookupsList : [];

    // cur emp status obj
    let empFlexPreffobj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10013;
    });
    this.flexibilityPreferenceList = (empFlexPreffobj && empFlexPreffobj.length) ? empFlexPreffobj[0].lookupsList : [];



    // cur emp status obj
    let relocationPreffobj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10016;
    });
    this.relocationPreferenceList = (relocationPreffobj && relocationPreffobj.length) ? relocationPreffobj[0].lookupsList : [];

    // this.formObj.legalStatus = 

    // cur emp status obj
    let milesListObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10014;
    });
    this.milesList = (milesListObj && milesListObj.length) ? milesListObj[0].lookupsList : [];

    let milesRoleListObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10017;
    });
    this.milesRoleList = (milesRoleListObj && milesRoleListObj.length) ? milesRoleListObj[0].lookupsList : [];


    // this.roleForm.value.roleMiles = ;

    // cur emp status obj
    let travelPercentageListObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10015;
    });
    this.travelPercentageList = (travelPercentageListObj && travelPercentageListObj.length) ? travelPercentageListObj[0].lookupsList : [];


    // this.getPreferences();
    this.getLanguageList();



  }

  getreviewdetails() {
    // console.log(this.loginForm.value);
    this.showSpinner = true;
    this.reviewdetailsLoaded = true;
    this.userService.getreviewdetails().subscribe((response: any) => {
      this.showSpinner = false;
      // console.log(response);
      // let resp = JSON.parse(response);
      // console.log(response.Status);
      // employmentList
      // console.log(response);
      if (response && response.Status == 401) {
        this.toastr.error(response.Message);
      }
      if (response && response.Success) {

        //console.log(this.editedBasicInfoRecordData);
        //*** career Summary */

        // this.dataSource = response;
        // 10018003
        if (response.assessmentsList && response.assessmentsList) {
          let totalAssessments = 0;
          let assessmentCount = 0;
          for (let i = 0; i < response.assessmentsList.length; i++) {
            // this.dataSource[i].push('send');
            if (response.assessmentsList[i].primaryAssessment) {
              totalAssessments++;
              if (response.assessmentsList[i].count > 0) {
                assessmentCount++;
              }
            }
          }
          this.countChange.updateCount(assessmentCount);
          this.countChange.updateTotal(totalAssessments);
        }



        this.candData.name = this.auditlogService.decryptAES(response.contactInfoList[0].firstName) + ' ' + this.auditlogService.decryptAES(response.contactInfoList[0].lastName);

        let location = [];
          if (this.auditlogService.decryptAES(response.contactInfoList[0].address).trim()) {
            location.push(this.auditlogService.decryptAES(response.contactInfoList[0].address));
          }
          if (this.auditlogService.decryptAES(response.contactInfoList[0].apt).trim()) {
            location.push(this.auditlogService.decryptAES(response.contactInfoList[0].apt));
          }
          if (this.auditlogService.decryptAES(response.contactInfoList[0].cityName).trim()) {
            location.push(this.auditlogService.decryptAES(response.contactInfoList[0].cityName));
          }
          if (this.auditlogService.decryptAES(response.contactInfoList[0].stateName).trim()) {
            location.push(this.auditlogService.decryptAES(response.contactInfoList[0].stateName));
          }
          if (this.auditlogService.decryptAES(response.contactInfoList[0].countryName).trim()) {
            location.push(this.auditlogService.decryptAES(response.contactInfoList[0].countryName));
          }
          if (this.auditlogService.decryptAES(response.contactInfoList[0].zipcode).trim()) {
            location.push(this.auditlogService.decryptAES(response.contactInfoList[0].zipcode));
          }
        this.candData.location = location.join(', ');

        this.candData.firstName = this.auditlogService.decryptAES(response.contactInfoList[0].firstName);
        this.candData.lastName = this.auditlogService.decryptAES(response.contactInfoList[0].lastName);
        this.candData.jobTitle = this.auditlogService.decryptAES(response.contactInfoList[0].jobTitle);
        this.candData.email = this.auditlogService.decryptAES(response.contactInfoList[0].email);
        this.candData.phoneNo = this.auditlogService.decryptAES(response.contactInfoList[0].phoneNo);
        this.candData.cityName = this.auditlogService.decryptAES(response.contactInfoList[0].cityName);
        this.candData.stateName = this.auditlogService.decryptAES(response.contactInfoList[0].stateName);
        this.candData.countryName = this.auditlogService.decryptAES(response.contactInfoList[0].countryName);
        this.candData.zipcode = this.auditlogService.decryptAES(response.contactInfoList[0].zipcode);
        this.candData.empHistory = response.employmentList.map((obj: any) => ({ ...obj }));
        this.candData.education = response.educationList.map((obj: any) => ({ ...obj }));
        this.candData.skills = response.skillsList.map((obj: any) => ({ ...obj }));
        this.candData.socialsLinks = response.socialLinksList.map((obj: any) => ({ ...obj }));
        this.candData.languages = response.languageList.map((obj: any) => ({ ...obj }));
        if (response.summary && response.summary.length) {
          this.candData.careersummary = this.auditlogService.decryptAES(response.summary['0'].summaryDesc);
        } else {
          this.candData.careersummary = '';
        }


        this.candData.certficationList = response.certficationList.map((obj: any) => ({ ...obj }));

        this.candData.trainingList = response.trainingList;

        this.candData.empHistory.forEach((ele: any) => {
          ele.jobTitle = (ele.jobTitle) ? this.auditlogService.decryptAES(ele.jobTitle) : '';
          ele.companyName = (ele.companyName) ? this.auditlogService.decryptAES(ele.companyName) : '';
          ele.workAddress = (ele.workAddress) ? this.auditlogService.decryptAES(ele.workAddress) : '';
          ele.empResponsibilities = (ele.empResponsibilities) ? this.auditlogService.decryptAES(ele.empResponsibilities.replace(/\n/g, "").replace(/\r/g, "")) : '';
          // ele.jobTitle = (ele.jobTitle) ? this.auditlogService.decryptAES(ele.jobTitle) : '';
          // endDate: "2021-10-02 00:00:00.0"
          // startDate: "2018-01-01 00:00:00.0"
          // currentCompany: true
        });
        this.candData.education.forEach((ele: any) => {
          ele.degreeName = (ele.degreeName) ? this.auditlogService.decryptAES(ele.degreeName) : '';
          ele.degreeType = (ele.degreeType) ? this.auditlogService.decryptAES(ele.degreeType) : '';
          ele.schoolName = (ele.schoolName) ? this.auditlogService.decryptAES(ele.schoolName) : '';
          // degreeCompletionDate: "2010-01-01 00:00:00.0"
        });
        let skillsObj = this.userService.categoryList.filter(function (obj: any) {
          return obj.categoryID == 10004;
        });
        this.candData.skills.forEach((ele: any) => {
          // skillName: "adobe xd"
          // skillLevelID: 10004999
          // userSkillID: 1041
          // skillID: 79
          let tempObj = skillsObj[0].lookupsList.filter(function (obj: any) {
            return obj.lookupId == ele.skillLevelID;
          });
          ele.skillValue = (tempObj.length) ? tempObj[0].lookupValue : '';
        });
        console.log(this.candData.skills);


        let socialsObj = this.userService.categoryList.filter(function (obj: any) {
          return obj.categoryID == 10007;
        });
        this.candData.socialsLinks.forEach((ele: any) => {
          let tempObj = socialsObj[0].lookupsList.filter(function (obj: any) {
            return obj.lookupId == ele.socialTypeLookupID;
          });

          ele.socialValue = (tempObj.length) ? tempObj[0].lookupValue : '';

          // socialURL: "www.linkedin.com/aditya"
          // userSocialID: 16
        });

        let langsObj = this.userService.categoryList.filter(function (obj: any) {
          return obj.categoryID == 10009;
        });
        this.candData.languages.forEach((ele: any) => {
          let tempObj = langsObj[0].lookupsList.filter(function (obj: any) {
            return obj.lookupId == ele.langExpertLookupID;
          });
          if (tempObj.length) {
            ele.langValue = tempObj[0].lookupValue;
          }
          let tempObj1 = this.masterLanguagesList.filter(function (obj: any) {
            return obj.languageCode == ele.langCode;
          });
          if (tempObj1.length) {
            ele.langName = tempObj1[0].languageName;
          }
        });

        let certsObj = this.userService.categoryList.filter(function (obj: any) {
          return obj.categoryID == 10005;
        });
        this.candData.certficationList.forEach((ele: any) => {
          ele.authorityName = (ele.authorityName) ? this.auditlogService.decryptAES(ele.authorityName) : '';
          ele.certName = (ele.certName) ? this.auditlogService.decryptAES(ele.certName) : '';
          ele.authorityName = (ele.authorityName) ? this.auditlogService.decryptAES(ele.authorityName) : '';
          let tempObj = certsObj[0].lookupsList.filter(function (obj: any) {
            return obj.lookupId == ele.certTypeLookupID;
          });
          if (tempObj.length) {
            ele.certValue = tempObj[0].lookupValue;
          }
        });

          let trainingsObj = this.userService.categoryList.filter(function (obj: any) {
            return obj.categoryID == 10006;
          });
          this.candData.trainingList = response.trainingList;
          this.candData.trainingList.forEach((ele: any) => {
            ele.trainingName = (ele.trainingName) ? this.auditlogService.decryptAES(ele.trainingName) : '';
            ele.institutionName = (ele.institutionName) ? this.auditlogService.decryptAES(ele.institutionName) : ''; 
            ele.completedYear = this.userService.getDateFormat(ele.completedYear);
            let tempObj = trainingsObj[0].lookupsList.filter(function (obj: any) {
              return obj.lookupId == ele.trainingTypeLookupID;
            });
            if (tempObj.length) {
              ele.trainValue = tempObj[0].lookupValue;
            }
          });
        this.getPreferences();

      }

    }, (error => {

    }));
  }

  getLanguageList() {

    this.userService.getlanguageslist().subscribe((response: any) => {
      if (response && response.Status) {
        if (response.languagesList) {
          this.masterLanguagesList = response.languagesList;
        }
        //console.log(this.languagesList)

        if (!this.reviewdetailsLoaded) {
           this.getreviewdetails();
        }
      }
    }, (error => {
    }));
  }


  ngOnInit(): void {

    if (!this.userService.isUserLoggedIn()) {

      // this.router.navigate(['/login']);
      Emitters.authEmitter.emit(false);
      // return;
    } else {
      this.staticAuditLogAPI('67', '');
      // Emitters.authEmitter.emit(true);

    }

    if (this.userService.categoryList && this.userService.categoryList.length) {
      this.categoryList = this.userService.categoryList;
      this.getIndividualObject();
    } else {
      this.getcategorylist();
    }



  }
  ngOnDestroy(): void {
    this.saveHtml();

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
