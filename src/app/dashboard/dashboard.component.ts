import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ConfirmDialogModel, DeleteConfirmDialogComponent } from '../common-component/modals/delete-confirm-dialog/delete-confirm-dialog.component';
import { EditProfileComponent } from '../common-component/modals/edit-profile/edit-profile.component';
import { ShowProfileComponent } from '../common-component/modals/show-profile/show-profile.component';
import { AuditlogService } from '../shared/auditlog.service';
import { HtmlConvertionService } from '../shared/services/html-convertion.service';
import { RemoveJunkTextService } from '../shared/services/remove-junk-text.service';
import { UserAuthService } from '../user-auth.service';
import { Emitters } from '../class/emitters/emitters';
import { AssessmentCountService } from '../shared/services/assessment-count.service';

export interface Job {
  jobtitle: string;
  compname: string;
  city: string;
  state: string;
  date: string;
  description: string;
  descShort: string;
  payrange: string;
  payrange1: Number | string;
  payrange2: Number | string;
  paytype: string;
  applied: Boolean;
  jobid: number;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {

  googleMapicon = environment.FrontEndURLForUser + "assets/icons/google-map.svg";
  user_icon: any;
  deleteconfirmresult:any;
  loadProfile = true;
  @ViewChild(ShowProfileComponent) generatePDF: ShowProfileComponent | undefined;
  
  profileImageBase64: any;

  constructor(
    public dialog: MatDialog,
    private userService: UserAuthService,
    private toastr: ToastrService,
    private auditlogService: AuditlogService,
    private router: Router,
    private htmlConvert: HtmlConvertionService,
    public rj: RemoveJunkTextService,
    public domSanitizer: DomSanitizer,
    private countChange: AssessmentCountService
  ) { 
    this.badgesPath = environment.badgesPath;
}

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
    address: '',
    apt: '',
    verifiedPhone:'',
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
    miles: '',
    profilePicPath: ''
  };
  jobsList: Job[] = [];
  candDataLoad = false;
  jobsDataLoad = false;
  prefDataLoad = false;
  resumeData = {
    name: '',
    path: '',
    date: '',
    pdfDown: ''
  }
  profilePicId = '';
  showSpinner = false;
  file: File[] = [];
  fileExt = '';
  progressPercentage = 0;
  firstName:any;
  lastName:any;
  email:any;
  otherCandData = {
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
    travelPref: '',
    relocationPref: '',
    rolePref: '',
    legalUS: '',
    requireVisa: ''
  };
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  itemsPerSlide = 2;
  noWrapSlides = false;
  showIndicator = false;
  myInterval = 5000000;

  masterLanguagesList: any = [];
  categoryListLoaded = false;
  masterLanguagesListLoaded = false;
  reviewdetailsLoaded = false;
  categoryList: any;
  assessmentsList : any = [];
  goldBadges : any = [];
  assessmentsReportsList:any;
  useridToPass = localStorage.getItem('userId');
  authToken = localStorage.getItem('userToken');
  orderId: any;
  pdfId: any;
  frontEndURL: any;
  dataToPass: any;
  assessmentsId: any;
  
  badgesPath:any;
  graphimagePath:any;
  starNinja:boolean = false;
  candPage:any;

  simpleArray : any = [];

  getLanguageList() {
    this.showSpinner = true;

    this.userService.getlanguageslist().subscribe((response: any) => {
      if (response && response.Status) {
        if (response.languagesList) {
          this.masterLanguagesList = response.languagesList;
        }
        //console.log(this.languagesList)

        if (!this.reviewdetailsLoaded) {
          this.getreviewdetails();
        } else {        
        this.showSpinner = false;
      }
      }
    }, (error => {
    }));
  }
  getRecommendJobs() {
    let jobId =  0;
    this.userService.getRecommendedJobs(jobId).subscribe((response: any) => {
        this.jobsDataLoad = true;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Status) {
          // response = JSON.parse(response);

          console.log(response);
          if (response.recommendedJobs.length) {
            response.recommendedJobs.forEach((el: any) => {
              el.applied = false;
              el.description = this.rj.removeJunk(el.description);
              el.descShort = this.rj.removeJunk(el.description.replace(/\r\n/g, ' ').replace(/<br \/>/g, ' '));
              el.date = this.userService.getDateFormat(el.date);
              el.payrange1 = el.payrange;
              // if (el.payrange.includes('-')) {
              //   if (el.payrange.split('-')[0]) {
              //     el.payrange1 = parseFloat(el.payrange.split('-')[0]).toFixed(2);
              //     el.payrange1 = (el.payrange1 != "0.00") ? el.payrange1 : ''
              //   }
              //   if (el.payrange.split('-')[1]) {
              //     el.payrange2 = parseFloat(el.payrange.split('-')[1]).toFixed(2);
              //     el.payrange2 = (el.payrange2 != "0.00") ? el.payrange2 : ''
              //   }
              //   el.payrange = '';
              // }
            });
          }
          this.jobsList = response.recommendedJobs;


        }

      }, (error => {

      }));
  }

  getJobNumber(){
    return Math.floor(Math.random()*(999-100+1)+100);
  }

  isNinja(){
    let isGold = true;
    let sortedPrimaryList =  this.assessmentsList.filter(
      (choice: any) =>
      {
         return ((choice.primaryAssessment === true)) ;
      }
    );
    let sortedGoldList =  sortedPrimaryList.filter(
      (choice: any) =>
      {
         return ((choice.requiredBadgePath.toLowerCase()).indexOf('gold') != '-1') ;
      }
    );

    this.starNinja = (sortedPrimaryList.length == sortedGoldList.length);
    console.log(this.starNinja);
    
  }

  getreviewdetails() {
    this.showSpinner = true;
    this.reviewdetailsLoaded = true;
    this.userService.getreviewdetails().
      subscribe((response: any) => {
        this.candDataLoad = true;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
          this.showSpinner = false;
        }
        if (response && response.Status) {
          // response = JSON.parse(response);

          console.log(response);
          this.goldBadges = [];

          localStorage.setItem('firstName', response.contactInfoList[0].firstName);
          localStorage.setItem('lastName', response.contactInfoList[0].lastName);
          localStorage.setItem('email', response.contactInfoList[0].email);
          this.firstName = this.auditlogService.decryptAES(response.contactInfoList[0].firstName);
          this.lastName = this.auditlogService.decryptAES(response.contactInfoList[0].lastName);
          this.email = this.auditlogService.decryptAES(response.contactInfoList[0].email);

          // this.assessmentsList = response.assessmentsList;
          // for(let i=0;i<this.assessmentsList.length; i++){
          //   if(this.assessmentsList[i].requiredBadgePath.toLowerCase().indexOf('gold') != '-1'){
          //     this.goldBadges.push(this.assessmentsList[i]);
          //   }
          // }
          // this.isNinja();
          
        // if (response.assessmentsList && response.assessmentsList) {
        //   let totalAssessments = 0;
        //   let assessmentCount = 0;
        //   for (let i = 0; i < response.assessmentsList.length; i++) {
        //     // this.dataSource[i].push('send');
        //     if (response.assessmentsList[i].primaryAssessment) {
        //       totalAssessments++;
        //       if (response.assessmentsList[i].count > 0) {
        //         assessmentCount++;
        //       }
        //     }
        //   }
        //   this.countChange.updateCount(assessmentCount);
        //   this.countChange.updateTotal(totalAssessments);
        // }
         
          // if (response.assessmentsReportsList && response.assessmentsReportsList.length && response.assessmentsReportsList['0'].assessmentReportURL != '') {
          //       // this.graphimagePath = environment.amazonS3 + 'Sevron/' +response.assessmentsReportsList['0'].assessmentReportURL;
          //       this.graphimagePath = response.assessmentsReportsList['0'].assessmentReportURL;
          //       this.assessmentsReportsList = true;
          // }else{
          //      this.assessmentsReportsList = false;
          // }
          

          this.candData.name = this.auditlogService.decryptAES(response.contactInfoList[0].firstName) + ' ' + this.auditlogService.decryptAES(response.contactInfoList[0].lastName);

          this.candData.jobTitle = this.auditlogService.decryptAES(response.contactInfoList[0].jobTitle);

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
          if (response.resumePath && response.resumePath.length) {
            this.resumeData.name = response.resumePath[0].resumeName;
            this.resumeData.path = environment.amazonS3 + 'Sevron/' + response.resumePath[0].resumeID;
            this.resumeData.pdfDown = (response.resumePath[0].resumeTOPdfPath) ? environment.amazonS3 + 'Sevron/' + localStorage.getItem("userId") + '/' + response.resumePath[0].resumeTOPdfPath : '';
          }
          if (response.profilePicPath && response.profilePicPath.length) {
            (response.profilePicPath[0].profileID) ? this.candData.profilePicPath = environment.amazonS3 + 'CandidateProfilepic/' + response.profilePicPath[0].profileID : '';
            this.profilePicId = response.profilePicPath[0].userProfileID;
            (response.profilePicPath[0].profilepicBase64) ? this.candData.profilePicPath = response.profilePicPath[0].profilepicBase64 : '';
            // this.profileImageBase64 = this.domSanitizer.bypassSecurityTrustResourceUrl((response.profilePicPath[0].profilepicBase64) ? (response.profilePicPath[0].profilepicBase64).toString(): '');
            this.profileImageBase64 = ((response.profilePicPath[0].profilepicBase64) ? (response.profilePicPath[0].profilepicBase64).toString(): '');
          }

          this.candData.firstName = this.auditlogService.decryptAES(response.contactInfoList['0'].firstName);
          this.candData.lastName = this.auditlogService.decryptAES(response.contactInfoList['0'].lastName);
          if (response.contactInfoList['0'].jobTitle) {
            this.candData.jobTitle = this.auditlogService.decryptAES(response.contactInfoList['0'].jobTitle)
          } else {
            this.candData.jobTitle = '';
          }
          this.candData.email = this.auditlogService.decryptAES(response.contactInfoList['0'].email);
          this.candData.phoneNo = this.auditlogService.decryptAES(response.contactInfoList['0'].phoneNo);
          this.candData.cityName = this.auditlogService.decryptAES(response.contactInfoList['0'].cityName);
          this.candData.stateName = this.auditlogService.decryptAES(response.contactInfoList['0'].stateName);
          this.candData.countryName = this.auditlogService.decryptAES(response.contactInfoList['0'].countryName);
          this.candData.zipcode = this.auditlogService.decryptAES(response.contactInfoList['0'].zipcode);

          this.candData.address = (response.contactInfoList['0'].address) ? this.auditlogService.decryptAES(response.contactInfoList['0'].address) : '';
          this.candData.apt = (response.contactInfoList['0'].apt) ? this.auditlogService.decryptAES(response.contactInfoList['0'].apt) : '';
          this.candData.verifiedPhone = response.contactInfoList['0'].verifiedPhone;

          // this.otherCandData = response;

          // if (response.summary && response.summary.length) {
          //   this.otherCandData.careersummary = response.summary[0].summaryDesc;
          // }


        if (response.summary && response.summary.length) {
                  this.candData.careersummary = response.summary[0].summaryDesc ? this.rj.addPrintBreaks(this.auditlogService.decryptAES(response.summary[0].summaryDesc)) : '';

        }


          this.candData.empHistory = response.employmentList;
          this.candData.education = response.educationList;
          this.candData.skills = response.skillsList;
          this.candData.socialsLinks = response.socialLinksList;
          this.candData.languages = response.languageList;

          this.candData.certficationList = response.certficationList;
          this.candData.trainingList = response.trainingList;
          // this.candData.legalUS = (this.candData.legalUS == "1") ? 'Yes' : (this.candData.legalUS == "2") ? 'No' : '';
          // this.candData.requireVisa = (this.candData.requireVisa == "1") ? 'Yes' : (this.candData.requireVisa == "2") ? 'No' : '';

          

          this.otherCandData.empHistory = response.employmentList;
          this.otherCandData.education = response.educationList;
          this.otherCandData.skills = response.skillsList;
          this.otherCandData.socialsLinks = response.socialLinksList;
          this.otherCandData.languages = response.languageList;
          
          this.otherCandData.certficationList = response.certficationList;
          this.otherCandData.trainingList = response.trainingList;
          // this.otherCandData.legalUS = (this.candData.legalUS == "1") ? 'Yes' : (this.candData.legalUS == "2") ? 'No' : '';
          // this.otherCandData.requireVisa = (this.candData.requireVisa == "1") ? 'Yes' : (this.candData.requireVisa == "2") ? 'No' : '';

          


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
  
          console.log(this.candData.trainingList);

          


          this.showSpinner = false;
          if (this.candDataLoad && this.prefDataLoad) {
            this.calcPercentage();
          }

        }

      }, (error => {

      }));
  }
  getPreferenceDetails() {
    this.userService.getPreferences().
      subscribe((response: any) => {
        this.prefDataLoad = true;

        this.candDataLoad = true;
        this.showSpinner = false;
        if (response && response.Status == 401) {
          this.toastr.error(response.message);
        }
        if (response && response.Success) {
          if (response.preferenceList && response.preferenceList.length) {
            this.otherCandData.currEmpStatus = response.preferenceList[0].empStatusLookupID;
            this.otherCandData.availability = response.preferenceList[0].empAvailLookupID;
            this.otherCandData.empPerf = response.preferenceList[0].empPrefLookupID;
            this.otherCandData.flexibilityPref = response.preferenceList[0].empFlexLookupID;
            this.otherCandData.compensationPref = response.preferenceList[0].empHourCompensation;
            this.otherCandData.travelPref = response.preferenceList[0].empTravelMilesLookupID || response.preferenceList[0].empRoleMilesLookupID;
            this.otherCandData.relocationPref = response.preferenceList[0].empRelocPrefLookupID;
            this.otherCandData.rolePref = response.preferenceList[0].empPrefRoleTitle;
            this.otherCandData.legalUS = response.preferenceList[0].legalStatus;
            this.otherCandData.requireVisa = response.preferenceList[0].visaSponsorStatus;

            let milesListObj = this.userService.categoryList ? (this.userService.categoryList.filter(function (obj: any) {
              return obj.categoryID == 10014;
            })) : [];
            if (milesListObj && milesListObj.length) {
              milesListObj[0].lookupsList.forEach((element: { lookupValue: any; lookupId: any; }) => {
                if (element.lookupId == response.preferenceList[0].empRoleMilesLookupID) {
                  // this.roleForm.controls.roleMiles.setValue(element.lookupId);
                }
              });
            }
            this.candData.empHourCompensation = response.preferenceList[0].empHourCompensation;
            this.candData.empPrefLocation = response.preferenceList[0].empPrefLocation;
            this.candData.empPrefRoleTitle = response.preferenceList[0].empPrefRoleTitle;

            this.candData.requireVisa = response.preferenceList[0].visaSponsorStatus;
            this.candData.legalUS = response.preferenceList[0].legalStatus;
            this.candData.compensationPref = response.preferenceList[0].empYearCompensation;

            /***************** Yes-no  */
              
              this.candData.legalUS = (this.candData.legalUS == "1") ? 'Yes' : (this.candData.legalUS == "2") ? 'No' : '';
              this.candData.requireVisa = (this.candData.requireVisa == "1") ? 'Yes' : (this.candData.requireVisa == "2") ? 'No' : '';
              this.candData.compensationPref = (this.candData.compensationPref) ? (this.candData.compensationPref) : '';
              this.candData.empHourCompensation = (this.candData.empHourCompensation) ? (this.candData.empHourCompensation) : '';
  

            let availObj = this.userService.categoryList.filter(function (obj: any) {
              return obj.categoryID == 10011;
            });
            let availTempObj = availObj[0].lookupsList.filter(function (obj: any) {
              return obj.lookupId == response.preferenceList[0].empAvailLookupID;
            });
            this.candData.availability = (availTempObj.length) ? availTempObj[0].lookupValue : '';

            let flexObj = this.userService.categoryList.filter(function (obj: any) {
              return obj.categoryID == 10013;
            });
            let flexTempObj = flexObj[0].lookupsList.filter(function (obj: any) {
              return obj.lookupId == response.preferenceList[0].empFlexLookupID;
            });
            this.candData.flexibilityPref = (flexTempObj.length) ? flexTempObj[0].lookupValue : '';

            let prefObj = this.userService.categoryList.filter(function (obj: any) {
              return obj.categoryID == 10012;
            });
            let prefTempObj = prefObj[0].lookupsList.filter(function (obj: any) {
              return obj.lookupId == response.preferenceList[0].empPrefLookupID;
            });
            this.candData.empPerf = (prefTempObj.length) ? prefTempObj[0].lookupValue : '';

            let relocationPrefObj = this.userService.categoryList.filter(function (obj: any) {
              return obj.categoryID == 10016;
            });
            let relocationPrefTempObj = relocationPrefObj[0].lookupsList.filter(function (obj: any) {
              return obj.lookupId == response.preferenceList[0].empRelocPrefLookupID;
            });
            this.candData.relocationPref = (relocationPrefTempObj.length) ? relocationPrefTempObj[0].lookupValue : '';

            let roleMilesObj = this.userService.categoryList.filter(function (obj: any) {
              return obj.categoryID == 10017;
            });
            let roleMilesTempObj = roleMilesObj[0].lookupsList.filter(function (obj: any) {
              return obj.lookupId == response.preferenceList[0].empRoleMilesLookupID;
            });
            this.candData.miles = (roleMilesTempObj.length) ? roleMilesTempObj[0].lookupValue : '';

            let empStatusObj = this.userService.categoryList.filter(function (obj: any) {
              return obj.categoryID == 10010;
            });
            let empStatusTempObj = empStatusObj[0].lookupsList.filter(function (obj: any) {
              return obj.lookupId == response.preferenceList[0].empStatusLookupID;
            });
            this.candData.currEmpStatus = (empStatusTempObj.length) ? empStatusTempObj[0].lookupValue : '';


            let travelPerObj = this.userService.categoryList.filter(function (obj: any) {
              return obj.categoryID == 10015;
            });
            let travelPerTempObj = travelPerObj[0].lookupsList.filter(function (obj: any) {
              return obj.lookupId == response.preferenceList[0].empTravelPerTimeLookupID;
            });
            this.candData.travelPrefPercent = (travelPerTempObj.length) ? travelPerTempObj[0].lookupValue : '';

            let travelMilesObj = this.userService.categoryList.filter(function (obj: any) {
              return obj.categoryID == 10014;
            });
            let travelMilesTempObj = travelMilesObj[0].lookupsList.filter(function (obj: any) {
              return obj.lookupId == response.preferenceList[0].empTravelMilesLookupID;
            });
            this.candData.travelPrefMiles = (travelMilesTempObj.length) ? travelMilesTempObj[0].lookupValue : '';

            console.log('HTML Completed');
            console.log(this.candData);
          }
          if (this.candDataLoad && this.prefDataLoad) {
            this.calcPercentage();
          }
        }
      }, (error => {
      }));
    // empAvailLookupID: 10011003
    // empCompThreshhold: false
    // empFlexLookupID: 10013001
    // empHourCompensation: 30
    // empPrefLocation: ""
    // empPrefLookupID: 10012003
    // empPrefRoleTitle: ""
    // empRelocPrefLookupID: 10016001
    // empRoleMilesLookupID: 10014005
    // empStatusLookupID: 10010001
    // empTravelMilesLookupID: 10014003
    // empTravelPerTimeLookupID: 10015008
    // empYearCompensation: 20
    // legalStatus: false
    // modifiedDateTime: "2021-10-01 06:31:53.0"
    // userAdditionID: 9
    // userID: 34
    // visaSponsorStatus: true
  }
  calcPercentage() {
    this.progressPercentage = 0;

    const basicInfo = 5;
    const careersummary = 5;
    const empHistory = 20;
    const education = 5;
    const skills = 5;
    const socialsLinks = 5;
    const languages = 5;
    const currEmpStatus = 5;
    const availability = 5;
    const empPerf = 5;
    const flexibilityPref = 5;
    const compensationPref = 5;
    // const travelPref = 5;
    // const relocationPref = 5;
    // const rolePref = 5;
    const legalUS = 5;
    const requireVisa = 5;
    const phoneNumber = 5;
    const addressAdded = 10;
    // debugger;
    if (Object.values(this.candData).some(v => v)) {
      this.progressPercentage += basicInfo;
    }
    if (this.otherCandData.careersummary) {
      this.progressPercentage += careersummary;
    }
    if (this.otherCandData.empHistory.length) {
      this.progressPercentage += empHistory;
    }
    if (this.otherCandData.education.length) {
      this.progressPercentage += education;
    }
    if (this.otherCandData.skills.length) {
      this.progressPercentage += skills;
    }
    if (this.otherCandData.socialsLinks.length) {
      this.progressPercentage += socialsLinks;
    }
    if (this.otherCandData.languages.length) {
      this.progressPercentage += languages;
    }
    if (this.otherCandData.currEmpStatus) {
      this.progressPercentage += currEmpStatus;
    }
    if (this.otherCandData.availability) {
      this.progressPercentage += availability;
    }
    if (this.otherCandData.empPerf) {
      this.progressPercentage += empPerf;
    }
    if (this.otherCandData.flexibilityPref) {
      this.progressPercentage += flexibilityPref;
    }
    if (this.otherCandData.compensationPref) {
      this.progressPercentage += compensationPref;
    }
    if (this.candData.phoneNo) {
      this.progressPercentage += phoneNumber;
    }
    if (this.candData.address) {
      this.progressPercentage += addressAdded;
    }
    // if (this.otherCandData.rolePref) {
    //   this.progressPercentage += rolePref;
    // }
    if (this.otherCandData.legalUS) {
      this.progressPercentage += legalUS;
    }
    if (this.otherCandData.requireVisa) {
      this.progressPercentage += requireVisa;
    }

  }
  onSelectFile(event: any,element:any) {
    console.log(event);
    // if (confirm("Are you sure want to replace file? ")) {
     console.log(event);
     const message = `Are you sure you want to replace profile?`;
     const dialogData = new ConfirmDialogModel("Confirm Action", message);
     const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
       maxWidth: "800px",
     // height: 'calc(100% - 160px)',
       data: dialogData
     });
   dialogRef.afterClosed().subscribe(dialogResult => {
       this.deleteconfirmresult = dialogResult;
       if(this.deleteconfirmresult){
         this.showSpinner = true;

      const allowedExts = ['pdf', 'doc', 'docx'];
      const file = event.target.files[0];
      const name = file.name;
      const ext = name.substr(name.lastIndexOf('.') + 1).toLowerCase();
      const allowed = allowedExts.some(e => e === ext);
      if (!allowed) {
        this.toastr.error(`File Extension ".${ext}" is not allowed.`);
        return;
      }
      if (file.size > 2097152) {
        // 1,048,576
        this.toastr.error(`File Size shouldn't exceed 2MB.`);
        return;
      }
      this.file.length = 0;
      this.file.push(...event.target.files);
      this.fileExt = ext;
      let formData = new FormData();
      let userId: any = localStorage.getItem("userId");
      formData.append("userId", userId);
      formData.append("resume", this.file[0]);
      this.showSpinner = true;
      let fileobj: any = {
        'filename': name,
        'extension':ext,
        'size': file.size
    }
     this.staticAuditLogAPI('90', JSON.stringify(fileobj));

      this.userService.resumeupload(formData).subscribe((response) => {
        console.log(response);
        this.showSpinner = false;
        if (response.Success) {
          this.toastr.success(response.Message);
          // this.router.navigate(['/create-upload-resume']);
          this.getreviewdetails();


        } else {
          this.toastr.error(response.Message);

        }

      }, (error => {

      }));

    }else{
       //console.log("NOoo")
       element.value = '';
       this.staticAuditLogAPI('109', '');
    }
  });
}

  imageUpload(event: any) {
    console.log(event);
    const allowedExts = ['jpeg', 'jpg', 'png'];
    const file = event.target.files[0];
    const name = file.name;
    const ext = name.substr(name.lastIndexOf('.') + 1);
    const allowed = allowedExts.some(e => e === ext);
    if (!allowed) {
      this.toastr.error(`File Extension ".${ext}" is not allowed.`);
      return;
    }
    this.file.length = 0;
    this.file.push(file);
    this.fileExt = ext;
    // let formData = new FormData();
    let userId: any = localStorage.getItem("userId");
    // formData.append("userId", userId);
    // formData.append("profilepic", this.file[0]);
    // if (this.profilePicId) {
    //   formData.append("userProfileID", this.profilePicId);
    // }
    this.showSpinner = true;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      //me.modelvalue = reader.result;
      console.log('base64' + reader.result);
      let dataToPass = {
        userId: localStorage.getItem("userId"),
        profilepicBase64: reader.result
      };
      let fileobj: any = {
        'filename': name,
        'extension':ext,
        'size': file.size
    }
     this.staticAuditLogAPI('87', JSON.stringify(fileobj));
      this.userService.imageUpload(dataToPass).subscribe((response) => {
        this.showSpinner = false;
        console.log(response);
        if (response.Success) {
          // this.profileImageBase64 = this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result) ? (reader.result).toString(): '');
          this.profileImageBase64 = ((reader.result) ? (reader.result).toString(): '');
          this.toastr.success("Profile picture has been uploaded Successfully.");
          // this.router.navigate(['/create-upload-resume']);
          // this.router.navigate(['/dashboard']);
          // this.getreviewdetails();

        } else {
          this.toastr.error(response.Message);

        }

      }, (error => {

      }));
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  saveImage(base64: any) {

  }
  openProfileModal(type:any): void {
    if(type){
      this.staticAuditLogAPI('83', '');
      this.candPage = '1';
    }else{
      this.staticAuditLogAPI('155', '');
      this.candPage = '3';
    }
    const dialogRef = this.dialog.open(EditProfileComponent, {
      height: 'calc(100% - 160px)',
      data: { candData: this.candData, candPage: this.candPage },
      // hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.candData = result;
        this.candData.name = result.firstName + ' ' + result.lastName;
        this.candData.firstName = result.firstName;
        this.candData.lastName = result.lastName;
        this.candData.jobTitle = result.jobTitle;
        this.candData.email = result.email;
        this.candData.phoneNo = result.phoneNo;
        this.candData.cityName = result.cityName;
        this.candData.stateName = result.stateName;
        this.candData.countryName = result.countryName;
        this.candData.zipcode = result.zipcode;
        this.candData.address = result.address;
        this.candData.apt = result.apt;
        this.candData.verifiedPhone = result.verifiedPhone;
        let location = [];
        if (result.cityName.trim()) {
          location.push(result.cityName);
        }
        if (result.stateName.trim()) {
          location.push(result.stateName);
        }
        if (result.countryName.trim()) {
          location.push(result.countryName);
        }
        this.candData.location = location.join(', ');
        // this.saveHtml();
      }
      console.log(result);
    });
  }

  saveHtml() {
    if (this.candData.firstName.trim() && this.candData.lastName.trim() && this.candData.email.trim()) {
      // alert('save Profile Called');
      console.log(this.candData);
      let dataToPass = {
        "userId": this.useridToPass,
        "htmlbody": this.htmlConvert.loadData(this.candData)
      }
      console.log(dataToPass);
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
    // console.log(this.loginForm.value);
    this.showSpinner = true;
    this.userService.getcategorylist().subscribe((response: any) => {
      // console.log(response);
      // let resp = JSON.parse(response);
      // console.log(response.Status);
      // employmentList
      // console.log(response);
      if (response && response.Success) {
        // this.toastr.error(response.message);
        this.userService.categoryList = response.CategoryList;
        this.categoryList = response.CategoryList;
      }
      if (!this.reviewdetailsLoaded) {
        this.getreviewdetails();
      } else {        
        this.showSpinner = false;
      }
    this.getPreferenceDetails();

      // if(response && response.Status){
      //   // response = JSON.parse(response);
      //   // this.employmentList = response.employmentList;
      // }

    }, (error => {

    }));
  }



  randomString(length: any) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
  openInviteForm(obj: any): void {
    console.log(obj);
    this.orderId = obj.orderId ? obj.orderId : this.randomString(10);
    localStorage.setItem('assessData', JSON.stringify(obj));
    localStorage.setItem('orderId', this.orderId);
    localStorage.setItem('assessmentsId', obj.assessmentsId)
    this.assessmentsId = obj.assessmentsId;
    // return;
     localStorage.removeItem('isAssessmentCompleted');

    if (obj.assessmentsId == "JB-ACCUICKEVP") {
      // obj.completionStatus == '10018001' ||
      if (obj.assessmentsId == "JB-ACCUICKEVP") {
        this.pdfId = "www4.accuick.com";
        this.saveAssessmentDatabase();
      } else {
        this.pdfId = obj.assessmentURL;
        this.goToAssessment();
      }
    } else {
       if (obj.completionStatus == '10018001') {
        //RESUME
        this.staticAuditLogAPI('143', JSON.stringify(obj));
        this.pdfId = obj.assessmentURL;
        this.goToAssessment();
      } else {

      this.dataToPass = {
        "packageId": { "value": obj.assessmentsId },
        "orderId": { "value": (this.orderId) },
        "candidate": {
          "first": this.firstName,
          "last": this.lastName,
          "email": this.email
        },
        "returnURL": {
          "uri": this.frontEndURL + "redirectassessment"
        }
        // "sendCandidateEmail": true
      }

       //START 
       if(obj.count == '0') {
        this.staticAuditLogAPI('142', JSON.stringify(this.dataToPass));
      }
      //RETAKE
      if(obj.count == 1) {
        this.staticAuditLogAPI('144', JSON.stringify(this.dataToPass));
      }


      this.showSpinner = true;
      this.userService.orderHireSelect(this.dataToPass).subscribe((response) => {
        console.log(response);
        this.showSpinner = false;
        if (response && response.assessmentAccessURL) {
          let ary = (response.assessmentAccessURL.uri.split('/'));
          this.pdfId = (ary[ary.length - 1]);
          this.saveAssessmentDatabase();

          // this.dialogRef.close((ary[ary.length -1]));

        }
      }, (error => {

      }));

      }
    }
    // if (obj.completionStatus == '10018001') {
    //   this.pdfId = obj.assessmentURL;
    //   this.goToAssessment();
    // } else {

    // this.dataToPass = {
    //   "packageId": { "value": obj.assessmentsId },
    //   "orderId": { "value": (this.orderId) },
    //   "candidate": {
    //     "first": (localStorage.getItem('firstName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('firstName') || '{}')) : '',
    //     "last": (localStorage.getItem('lastName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('lastName') || '{}')) : '',
    //     "email": (localStorage.getItem('email') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('email') || '{}')) : ''
    //   },
    //   "returnURL": {
    //    "uri": this.frontEndURL + "redirectassessment"
    //   } 
    //   // "sendCandidateEmail": true
    // }

    // this.showSpinner = true;
    // this.userService.orderHireSelect(this.dataToPass).subscribe((response) => {
    //   console.log(response);
    //   this.showSpinner = false;
    //   if (response && response.assessmentAccessURL) {
    //     let ary = (response.assessmentAccessURL.uri.split('/'));
    //     this.pdfId = (ary[ary.length - 1]);
    //     this.saveAssessmentDatabase();

    //     // this.dialogRef.close((ary[ary.length -1]));

    //   }
    // }, (error => {

    // }));
    // }
  }
  saveAssessmentDatabase() {
    let dataToPass = {
      "userId": localStorage.getItem('userId'),
      "assessmentsId": this.assessmentsId,
      "orderId": this.orderId,
      "assessmentURL": this.pdfId
    }

    this.showSpinner = true;
    this.userService.saveAssessmentDatabase(dataToPass).
    subscribe((response: any) => {
      this.showSpinner = false;
      if (response && response.Status == 401) {
        this.toastr.error(response.Message);
      }
      if (response && response.Status == 200) {
        if (this.assessmentsId == "JB-ACCUICKEVP") {
          this.goToRecorder();
        } else {
          this.goToAssessment();
        }
      }

    }, (error => {

    }));
  }

  goToAssessment() {
    this.router.navigate(['/assessment'], { queryParams: { 'id': this.pdfId, 'oId': this.orderId } });

  }
  goToRecorder() {
    this.router.navigate(['/recorder'], { queryParams: { 'id': this.assessmentsId, 'oId': this.orderId } });
  }

  ngOnInit(): void {

    //this.simpleArray = [1,2,3,4,5];
    if (!this.userService.isUserLoggedIn()) {

      this.router.navigate(['/login']);
      Emitters.authEmitter.emit(false);
      return;
    } else {
      this.staticAuditLogAPI('82', '');
      Emitters.authEmitter.emit(true);

    }
    this.frontEndURL = environment.FrontEndURLForUser;

    this.firstName = (localStorage.getItem('firstName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('firstName') || '{}')) : '';
    this.lastName = (localStorage.getItem('lastName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('lastName') || '{}')) : '';
    this.email = (localStorage.getItem('email') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('email') || '{}')) : '';

 
    //this.graphimagePath = "http://localhost:4200/assets/badge/349_graph.png";

    // this.graphimagePath = environment.amazonS3 + "Sevron/349_graph.png";
    
    this.user_icon = environment.FrontEndURLForUser + "assets/icons/user_icon.svg";
    if (this.userService.categoryList) {
      this.categoryList = this.userService.categoryList;
      this.categoryListLoaded = true;
      this.getPreferenceDetails();

    } else {
      this.getcategorylist();
    }
    if (this.userService.languagesList) {
      this.masterLanguagesList = this.userService.languagesList;
      this.masterLanguagesListLoaded = true;
    } else {
      this.getLanguageList();
    }
    if (this.categoryListLoaded && this.masterLanguagesListLoaded) {
      this.getreviewdetails();
    }
    this.getRecommendJobs();
    // this.getPreferenceDetails();

    
  }

  loadPDF() {
    this.loadProfile = false;
    this.showSpinner = true;
    setTimeout(() => {
      this.generatePDF?.generatePDF();
      this.showSpinner = false;
    }, 1000);
  }
  pdfLoaded(e: any) {
    this.loadProfile = true;
  }
  ngOnDestroy(): void {
    this.saveHtml();
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

onClickReplaceFile() {
  this.staticAuditLogAPI('89', '');
}
onClickProfilePicFile() {
  this.staticAuditLogAPI('86', '');
}




}
