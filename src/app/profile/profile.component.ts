import { Component, OnInit, ViewChild } from '@angular/core';
// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { UserAuthService } from '../user-auth.service';
import { Emitters } from '../class/emitters/emitters';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { ShowJobComponent } from '../common-component/modals/show-job/show-job.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowProfileComponent } from '../common-component/modals/show-profile/show-profile.component';
import { EditProfileComponent } from '../common-component/modals/edit-profile/edit-profile.component';
import { ClipboardComponent } from '../common-component/modals/clipboard/clipboard.component';
import { environment } from 'src/environments/environment';
// import { HtmlConvertionService } from '../shared/services/html-convertion.service';
import { HtmlToPdfConvertionService } from '../shared/services/html-to-pdf-convertion.service';
import * as moment from 'moment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RemoveJunkTextService } from '../shared/services/remove-junk-text.service';
import { ConfirmDialogModel, DeleteConfirmDialogComponent } from '../common-component/modals/delete-confirm-dialog/delete-confirm-dialog.component';
import { AssessmentCountService } from '../shared/services/assessment-count.service';

declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // Editor = ClassicEditorBuild;
  color = "accent";
  resumeBuilderFrom: any;
  categoryList: any;
  masterLanguagesList: any;
  showSpinner = false;

  googleMapicon = environment.FrontEndURLForUser + "assets/icons/google-map.svg";
  user_icon = environment.FrontEndURLForUser + "assets/icons/user_icon.svg";

  deleteconfirmresult: any;

  //*** employee */
  toggleEmployeeForm: boolean = false;
  toggleEditEmployeeForm: boolean = false;
  employmentList: any = [];
  employmentEditIndex: any;
  editedEmpRecordData: any;
  isendDate: any;
  eventEndTime: any;

  //*** education */
  toggleEducationForm: boolean = false;
  toggleEditEducationForm: boolean = false;
  educationList: any = [];
  educationEditIndex: any; //@Input
  editedEduRecordData: any // @input

  //*** training */
  toggleTrainingForm: boolean = false;
  toggleEditTrainingForm: boolean = false;
  trainingList: any = [];
  trainingEditIndex: any; //@Input
  editedTrainRecordData: any // @input
  /**** Socia lLinks */
  toggleSocialLinkForm: boolean = false;
  socialLinksList: any = [];
  socialLinkEditIndex: any //@input
  editedSLRecordData: any //@input
  toggleEditSocialLinkForm: boolean = false;
  /**** Languages */
  toggleLanguageForm: boolean = false
  languageEditIndex: any //@input
  editedLanguageRecordData: any //@input
  toggleEditLanguageForm: boolean = false;
  languageList: any = [];
  /*****  Basic Info */
  contactInfoList: any = []
  editedBasicInfoRecordData: any //@input
  /*****  Summary */
  toggleSummaryForm: boolean = false;
  toggleAddSummaryForm = false;
  SummaryEditIndex: any //@input
  editedSummaryRecordData: any //@input
  toggleEditSummaryForm: boolean = false;
  SummaryList: any = [];
  summaryDesc: any;
  datatoggle = false;
  dataDecryption: any;

  /******* Licence certificate */
  toggleLCForm: boolean = false
  LCEditIndex: any //@input
  editedLCRecordData: any //@input
  toggleEditLCForm: boolean = false;
  certficationList: any = [];

  /******* Licence certificate */
  toggleSkillsForm: boolean = false
  SkillsEditIndex: any //@input
  editedSkillsRecordData: any //@input
  toggleEditSkillsForm: boolean = false;
  skillsList: any = [];

  assessmentsList: any = [];
  badgesPath: any;


  //dateMinArrival = new Date();
  dateMinEndDate: any;
  startDateEmp = new Date();
  endDateEmp = new Date();
  lookupValueName: any;
  languageName: any;

  file: File[] = [];
  fileExt = '';

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
    verifiedPhone: '',
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
    profilePicPath: '',
    profileId:''
  };
  showPreviewBtn = false;
  profilePicId = '';

  resumeData = {
    name: '',
    path: '',
    date: '',
    pdfDown: ''
  }
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  categoryListLoaded = false;
  masterLanguagesListLoaded = false;
  reviewdetailsLoaded = false;
  blob: any;
  loadProfile = true;
  @ViewChild(ShowProfileComponent) generatePDF: ShowProfileComponent | undefined;
  useridToPass = localStorage.getItem('userId');
  authToken = localStorage.getItem('userToken');
  profileImageBase64: any;
  goldBadges: any = [];
  starNinja: boolean = false;
  empAvailabilityStatusList: any =[];
  prefenceData:any;

  constructor(
    public dialog: MatDialog, private auditlogService: AuditlogService, private fb: FormBuilder,
    private userService: UserAuthService, private router: Router,
    private toastr: ToastrService, private sanitizer: DomSanitizer,
    private htmlConvert: HtmlToPdfConvertionService,
    public removeJunk: RemoveJunkTextService,
    public domSanitizer: DomSanitizer,
    private actRoute: ActivatedRoute,
    private countChange: AssessmentCountService

  ) {

    this.badgesPath = environment.badgesPath;
  }


  isNinja() {
    let isGold = true;
    let sortedPrimaryList = this.assessmentsList.filter(
      (choice: any) => {
        return ((choice.primaryAssessment === true));
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

  getcategorylist() {
    // console.log(this.loginForm.value);
    this.userService.getcategorylist().subscribe((response: any) => {
      // console.log(response);
      // let resp = JSON.parse(response);
      // console.log(response.Status);
      // employmentList
      // console.log(response);
      if (response && response.Success) {
        // this.toastr.error(response.Message);
        this.userService.categoryList = response.CategoryList;
        this.categoryList = response.CategoryList;
      }

      if (!this.reviewdetailsLoaded) {
        this.getreviewdetails();
      }
      // if(response && response.Status){
      //   // response = JSON.parse(response);
      //   // this.employmentList = response.employmentList;
      // }

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

  onSelectFile(event: any,element:any) {
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
      if (this.deleteconfirmresult) {
        this.showSpinner = true;
        //  if (confirm("Are you sure want to replace file? ")) {
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
          'extension': ext,
          'size': file.size
        }
        this.staticAuditLogAPI('99', JSON.stringify(fileobj));

        this.userService.resumeupload(formData).subscribe((response) => {
          console.log(response);
          this.showSpinner = false;
          if (response.Success) {
            this.toastr.success(response.Message);
            // this.router.navigate(['/profile']);
            this.getreviewdetails();


          } else {
            this.toastr.error(response.Message);

          }

        }, (error => {

        }));
        //}

      } else {
        //console.log("NOoo")
        element.value = '';
        this.staticAuditLogAPI('110', '');
      }
    }); //
  }

  ngOnInit(): void {
    this.actRoute.queryParams
      .subscribe(params => {
        // this.email = params.email ? params.email : '';
        // this.jobIdFromMail = params.jobId ? params.jobId : '';
        // if (params.email) {
        //   localStorage.setItem('emailFromProfile', params.email);
        // }

        if (!this.userService.isUserLoggedIn()) {
            if (params.email) {
              localStorage.setItem('emailFromProfile', params.email);
            }
          return;
        }

      });
    // if(this.actRoute.snapshot.params.email){
    //   localStorage.setItem('emailFromProfile', this.actRoute.snapshot.params.email);
    // }

    if (!this.userService.isUserLoggedIn()) {

      this.router.navigate(['/login']);
      Emitters.authEmitter.emit(false);
      return;
    } else {
      this.staticAuditLogAPI('91', '');
      Emitters.authEmitter.emit(true);

    }

    if (this.userService.categoryList) {
      this.categoryList = this.userService.categoryList;
      this.categoryListLoaded = true;
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
    // this.getLanguageList();
  }



  getreviewdetails() {
    // console.log(this.loginForm.value);
    this.reviewdetailsLoaded = true;
    this.showSpinner = true;
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
      if (response && response.Status) {
        // response = JSON.parse(response);
        this.goldBadges = [];
        // this.assessmentsList = response.assessmentsList;
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

        // for (let i = 0; i < this.assessmentsList.length; i++) {
        //   if (this.assessmentsList[i].requiredBadgePath.toLowerCase().indexOf('gold') != '-1') {
        //     this.goldBadges.push(this.assessmentsList[i]);
        //   }
        // }
        // this.isNinja();

        this.employmentList = response.employmentList;
        console.log(this.employmentList);
        for (let e = 0; e < this.employmentList.length; e++) {
          let eventEndTime = (moment(this.employmentList[e].endDate).format('YYYY-MM-DD'));
          let eventStartTime = (moment(this.employmentList[e].startDate).format('YYYY-MM-DD'));
          let m = moment(eventEndTime);
          let years = (m.diff(eventStartTime, 'years') != 0) ? (m.diff(eventStartTime, 'years')) : '';
          m.add(-years, 'years');
          let months = m.diff(eventStartTime, 'months');
          //m.add(-months, 'months');
          //let days = m.diff(eventStartTime, 'days');
          this.employmentList[e].countofYearsMonths = (years != '' ? years + " " + 'Yrs' : '') + " " + months + " " + 'Mos';
        }

        //*** Education */
        this.educationList = response.educationList;
        console.log(this.educationList);
        for (let ed = 0; ed < this.educationList.length; ed++) {
          if (this.educationList[ed].degreeCompletionDate != null && this.educationList[ed].degreeCompletionDate.indexOf("1900") != -1) {
            this.educationList[ed].degreeCompletionDate = "";
          } else {
            this.educationList[ed].degreeCompletionDate;
          }
        }

        //*** Training */
        this.trainingList = response.trainingList;
        console.log(this.trainingList);
        for (let t = 0; t < this.trainingList.length; t++) {
          if (this.trainingList[t].completedYear != null && this.trainingList[t].completedYear.indexOf("1900") != -1) {
            this.trainingList[t].completedYear = "";
          } else {
            this.trainingList[t].completedYear;
          }
        }

        //*** social links */
        this.socialLinksList = response.socialLinksList;
        console.log(this.socialLinksList);

        //*** Languages */
        this.languageList = response.languageList;
        console.log(this.languageList);
        //*** contact InfoList */
        //console.log(this.editedBasicInfoRecordData);

        //*** certfication List */
        this.certficationList = response.certficationList;
        console.log(this.certficationList);
        for (let ct = 0; ct < this.certficationList.length; ct++) {
          if (this.certficationList[ct].completedYear != (null) && this.certficationList[ct].completedYear.indexOf("1900") != -1) {
            this.certficationList[ct].completedYear = "";
          } else {
            this.certficationList[ct].completedYear;
          }
        }

        //*** skill List */
        this.skillsList = response.skillsList;
        console.log(this.skillsList);

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
          (response.profilePicPath[0].profilepicBase64) ? this.candData.profilePicPath = response.profilePicPath[0].profilepicBase64 : '';
          this.profilePicId = response.profilePicPath[0].userProfileID;
          this.profileImageBase64 = ((response.profilePicPath[0].profilepicBase64) ? (response.profilePicPath[0].profilepicBase64).toString() : '');
        }

        this.candData.firstName = (response.contactInfoList[0].firstName) ? this.auditlogService.decryptAES(response.contactInfoList[0].firstName) : '';
        this.candData.lastName = (response.contactInfoList[0].lastName) ? this.auditlogService.decryptAES(response.contactInfoList[0].lastName) : '';
        this.candData.jobTitle = (response.contactInfoList[0].jobTitle) ? this.auditlogService.decryptAES(response.contactInfoList[0].jobTitle) : '';
        this.candData.email = (response.contactInfoList[0].email) ? this.auditlogService.decryptAES(response.contactInfoList[0].email) : '';
        this.candData.phoneNo = (response.contactInfoList[0].phoneNo) ? this.auditlogService.decryptAES(response.contactInfoList[0].phoneNo) : '';
        this.candData.cityName = (response.contactInfoList[0].cityName) ? this.auditlogService.decryptAES(response.contactInfoList[0].cityName) : '';
        this.candData.stateName = (response.contactInfoList[0].stateName) ? this.auditlogService.decryptAES(response.contactInfoList[0].stateName) : '';
        this.candData.countryName = (response.contactInfoList[0].countryName) ? this.auditlogService.decryptAES(response.contactInfoList[0].countryName) : '';
        this.candData.zipcode = (response.contactInfoList[0].zipcode) ? this.auditlogService.decryptAES(response.contactInfoList[0].zipcode) : '';
        this.candData.verifiedPhone = (response.contactInfoList[0].verifiedPhone);
        this.candData.address = (response.contactInfoList[0].address) ? this.auditlogService.decryptAES(response.contactInfoList[0].address) : '';
        this.candData.profileId = response.contactInfoList[0].profileId;
        localStorage.setItem('profileId', this.candData.profileId)
          this.candData.apt = (response.contactInfoList['0'].apt) ? this.auditlogService.decryptAES(response.contactInfoList['0'].apt) : '';


        if (response.summary && response.summary.length) {
          this.SummaryList = response.summary;
          this.dataDecryption = (response.summary['0'].summaryDesc) ? this.removeJunk.addPrintBreaks(this.auditlogService.decryptAES(response.summary['0'].summaryDesc)) : '';
          this.summaryDesc = this.dataDecryption;
        }
        this.candData.careersummary = this.summaryDesc ? this.removeJunk.addPrintBreaks(this.summaryDesc) : '';

        this.employmentList.sort((a: any, b: any) => a.orderBy - b.orderBy);
        this.candData.empHistory = this.employmentList.map((obj: any) => ({ ...obj }));
        this.candData.education = this.educationList.map((obj: any) => ({ ...obj }));
        this.candData.skills = this.skillsList.map((obj: any) => ({ ...obj }));
        this.candData.socialsLinks = this.socialLinksList.map((obj: any) => ({ ...obj }));
        this.candData.languages = this.languageList.map((obj: any) => ({ ...obj }));
        this.candData.certficationList = this.certficationList.map((obj: any) => ({ ...obj }));
        this.candData.empHistory.forEach((ele: any) => {
          ele.jobTitle = (ele.jobTitle) ? this.auditlogService.decryptAES(ele.jobTitle) : '';
          ele.companyName = (ele.companyName) ? this.auditlogService.decryptAES(ele.companyName) : '';
          ele.workAddress = (ele.workAddress) ? this.auditlogService.decryptAES(ele.workAddress) : '';
          ele.empResponsibilities = (ele.empResponsibilities) ? this.removeJunk.addPrintBreaks(this.auditlogService.decryptAES(ele.empResponsibilities)) : '';
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

        let trainingsObj = this.userService.categoryList.filter(function (obj: any) {
          return obj.categoryID == 10006;
        });
        this.candData.trainingList = this.trainingList;
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

        let availLookups = this.userService.categoryList.filter(function (obj: any) {
          return obj.categoryID == 10011;
        });
         this.empAvailabilityStatusList = availLookups[0].lookupsList;
        console.log(this.empAvailabilityStatusList);
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
        this.getPreferences();





      }

    }, (error => {

    }));
  }

  changeAvailability(id:any){
    let formObj;
    if(this.prefenceData){
      formObj = this.prefenceData;
    } else {

      formObj = {
        "userAdditionID": 0,
        "empStatusLookupID": 0,
        "empAvailLookupID": 0,
        "empPrefLookupID": 0,
        "empFlexLookupID": 0,
        "empYearCompensation": 0,
        "empHourCompensation": 0,
        "empCompThreshhold": 0,
        "empTravelMilesLookupID": 0,
        "empTravelPerTimeLookupID": 0,
        "empRelocPrefLookupID": 0,
        "empPrefRoleTitle": "",
        "empPrefLocation": "",
        "empRoleMilesLookupID": 0,
        "legalStatus": 0,
        "userId": localStorage.getItem('userId'),
        "visaSponsorStatus": 0

      };
    }

        formObj.empAvailLookupID = id;

          let availTempObj = this.empAvailabilityStatusList.filter(function (obj: any) {
            return obj.lookupId == id;
          });
          this.candData.availability = (availTempObj.length) ? availTempObj[0].lookupValue : '';

    
    // candData.availability
    console.log(this.prefenceData);
    // let obj = formObj;

    this.userService.saveoreditpreferencedetails(formObj).subscribe((response) => {
      // this.listTodos();
      if (response.Success) {
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
          this.prefenceData=response.preferenceList[0];
          // this.roleForm.controls.preferredRoleTitle.setValue(response.preferenceList[0].empPrefRoleTitle);
          // this.roleForm.controls.preferredLocation.setValue(response.preferenceList[0].empPrefLocation);

          let milesListObj = this.userService.categoryList.filter(function (obj: any) {
            return obj.categoryID == 10014;
          });
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

          // this.candData.requireVisa = response.preferenceList[0].visaSponsorStatus;
          // this.candData.legalUS = response.preferenceList[0].legalStatus;
          this.candData.compensationPref = response.preferenceList[0].empYearCompensation;
            
          /***************** Yes-no  */
          this.candData.legalUS = (response.preferenceList[0].legalStatus == 1) ? 'Yes' : (response.preferenceList[0].legalStatus == 2) ? 'No' : '';
          this.candData.requireVisa = (response.preferenceList[0].visaSponsorStatus == 1) ? 'Yes' : (response.preferenceList[0].visaSponsorStatus == 2) ? 'No' : '';
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
          // console.log(this.htmlConvert.loadData(this.candData));

        }
        this.showPreviewBtn = true;
      }

    }, (error => {

    }));
  }

  openProfile() {
    localStorage.setItem('candidateData', JSON.stringify(this.candData));
    // const dialogRef = this.dialog.open(ShowProfileComponent, {
    //   height: 'calc(100% - 160px)',
    //   data: { candData: this.candData },
    //   // hasBackdrop: false,
    // });
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/profilePreview'])
    );
    window.open(url, '_blank');
  }

  openProfileModal(): void {
    this.staticAuditLogAPI('92', '');
    console.log(this.candData);
    const dialogRef = this.dialog.open(EditProfileComponent, {
      height: 'calc(100% - 160px)',
      data: { candData: this.candData, candPage: '2' },
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
        this.saveHtml();
      }
      console.log(result);
    });
  }

  openSharePopup(): void {
    const dialogRef = this.dialog.open(ClipboardComponent, {
      // height: 'calc(40%)',
      // width: 'calc(40%)',
      maxWidth: "800px",
      data: { candData: this.candData, candPage: '2' },
      // hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.candData = result;

      }
      console.log(result);
    });
  }


  updateCandData(obj: any) {
    if (obj.name == 'basicInfo') {
      this.candData.jobTitle = obj.candData.jobTitle;
      this.candData.firstName = obj.candData.firstName;
      this.candData.lastName = obj.candData.lastName;
      this.candData.phoneNo = obj.candData.phoneNo;
      this.candData.email = obj.candData.email;
      this.candData.zipcode = obj.candData.zipcode;
      this.candData.countryName = obj.candData.countryName;
      this.candData.stateName = obj.candData.stateName;
      this.candData.cityName = obj.candData.cityName;
      this.candData.address = obj.candData.address;
      this.candData.apt = obj.candData.apt;
      this.candData.verifiedPhone = obj.candData.verifiedPhone;
    }
    else if (obj.name == 'careerSummary') {
      this.candData.careersummary = obj.careerSummary;
      this.dataDecryption = obj.careerSummary;
    }
    else if (obj.name == 'emp') {
      this.candData.empHistory = this.employmentList.map((obj: any) => ({ ...obj }));
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
    }
    else if (obj.name == 'edu') {
      this.candData.education = this.educationList.map((obj: any) => ({ ...obj }));
      this.candData.education.forEach((ele: any) => {
        ele.degreeName = (ele.degreeName) ? this.auditlogService.decryptAES(ele.degreeName) : '';
        ele.degreeType = (ele.degreeType) ? this.auditlogService.decryptAES(ele.degreeType) : '';
        ele.schoolName = (ele.schoolName) ? this.auditlogService.decryptAES(ele.schoolName) : '';
        // degreeCompletionDate: "2010-01-01 00:00:00.0"
      });
    }
    else if (obj.name == 'skills') {
      this.candData.skills = this.skillsList.map((obj: any) => ({ ...obj }));
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
    }

    else if (obj.name == 'social') {
      this.candData.socialsLinks = this.socialLinksList.map((obj: any) => ({ ...obj }));
      let socialsObj = this.userService.categoryList.filter(function (obj: any) {
        return obj.categoryID == 10007;
      });
      this.candData.socialsLinks.forEach((ele: any) => {
        let tempObj = socialsObj[0].lookupsList.filter(function (obj: any) {
          return obj.lookupId == ele.socialTypeLookupID;
        });

        ele.socialValue = (tempObj.length) ? tempObj[0].lookupValue : '';
      });
    }
    else if (obj.name == 'lang') {
      this.candData.languages = this.languageList.map((obj: any) => ({ ...obj }));
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
    }
    else if (obj.name == 'certi') {
      let certsObj = this.userService.categoryList.filter(function (obj: any) {
        return obj.categoryID == 10005;
      });
      this.candData.certficationList = this.certficationList.map((obj: any) => ({ ...obj }));
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
    }
    else if (obj.name == 'train') {
      this.candData.trainingList = this.trainingList;
      let trainingsObj = this.userService.categoryList.filter(function (obj: any) {
        return obj.categoryID == 10006;
      });
      this.candData.trainingList.forEach((ele: any) => {
        ele.trainingName = (ele.trainingName) ? ele.trainingName : '';
        ele.institutionName = (ele.institutionName) ? ele.institutionName : '';
        let tempObj = trainingsObj[0].lookupsList.filter(function (obj: any) {
          return obj.lookupId == ele.trainingTypeLookupID;
        });
        if (tempObj.length) {
          ele.trainValue = tempObj[0].lookupValue;
        }
      });
    }

    this.saveHtml();
  }
  filterSkill(id: any) {
    let skillsObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10004;
    });
    let tempObj = skillsObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == id;
    });
    return (tempObj.length) ? tempObj[0].lookupValue : '';
  }
  filterTraining(id: any) {
    let trainingObj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10006;
    });
    let tempObj = trainingObj[0].lookupsList.filter(function (obj: any) {
      return obj.lookupId == id;
    });
    return (tempObj.length) ? tempObj[0].lookupValue : '';
  }
  saveHtml() {
    if (this.candData.firstName.trim() && this.candData.lastName.trim() && this.candData.email.trim()) {
      // alert('save Profile Called');
      //console.log(">>>>>>>")
      console.log(this.candData)
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
  // downPDF(path: string, name: string) {
  //   this.userService.getPdf(path).subscribe((data: any) => {

  //     this.blob = new Blob([data], { type: 'application/pdf' });

  //     var downloadURL = window.URL.createObjectURL(data);
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = name;
  //     link.click();

  //   });
  // }
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
        'extension': ext,
        'size': file.size
      }
      this.staticAuditLogAPI('96', JSON.stringify(fileobj));
      this.userService.imageUpload(dataToPass).subscribe((response) => {
        this.showSpinner = false;
        console.log(response);
        if (response.Success) {
          this.profileImageBase64 = this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result) ? (reader.result).toString() : '');
          this.candData.profilePicPath = (reader.result) ? (reader.result).toString() : '';
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

  //*** Employment */

  addEmployees() {
    this.staticAuditLogAPI('17', '');
    //  this.employeesArray().push(this.employeesGroup());
    this.employmentEditIndex = null;
    this.editedEmpRecordData = null;
    this.toggleEmployeeForm = !this.toggleEmployeeForm;
  }

  editEmpForm(indx: any) {
    this.staticAuditLogAPI('20', '');
    this.employmentEditIndex = indx;
    this.editedEmpRecordData = this.employmentList[indx];
    this.toggleEditEmployeeForm = !this.toggleEditEmployeeForm;
  }


  deleteEmpForm(indx: any) {
    this.staticAuditLogAPI('119', '');
    const message = `Are you sure you want to delete this employment record?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      maxWidth: "800px",
      // height: 'calc(100% - 160px)',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.deleteconfirmresult = dialogResult;
      if (this.deleteconfirmresult) {
        this.showSpinner = true;
        let id = this.employmentList[indx].userEmploymentID;
        let jsonObj = { userEmploymentID: id }
        this.staticAuditLogAPI('23', JSON.stringify(jsonObj));
        this.userService.deleteemploymentrecord(id).subscribe((response: any) => {
          // console.log(response);
          // let resp = JSON.parse(response);
          // console.log(response.Status);
          // employmentList
          // console.log(response);
          if (response && response.Status) {
            // response = JSON.parse(response);
            this.employmentList.splice(indx, 1);
            // console.log(this.employmentList);
            this.updateCandData({ name: 'emp' });
            this.showSpinner = false;

          }

        }, (error => {

        }));


      } else {
        //console.log("NOoo")
        this.staticAuditLogAPI('120', '');
      }
    }); //


  }

  addEmployment($event: Event) {
    console.log($event);
    this.employmentList.push($event);
    this.toggleEmployeeForm = !this.toggleEmployeeForm;
    this.updateCandData({ name: 'emp' });
  }

  editEmployment($event: Event) {
    console.log($event);
    this.employmentList[this.employmentEditIndex] = ($event);
    this.employmentEditIndex = null;
    this.updateCandData({ name: 'emp' });
    this.toggleEditEmployeeForm = !this.toggleEditEmployeeForm;
  }

  closeForm(data: any) {
    if (data == 'edit') {
      this.employmentEditIndex = null;
    } else {
      this.toggleEmployeeForm = false;
    }
  }


  //*** Education */

  //plus icon
  addEducations() {
    this.staticAuditLogAPI('24', '');
    this.educationEditIndex = null;
    this.editedEduRecordData = null;
    this.toggleEducationForm = !this.toggleEducationForm;
  }

  //pencil icon
  editEduForm(indx: any) {
    this.staticAuditLogAPI('27', '');
    this.educationEditIndex = indx;
    this.editedEduRecordData = this.educationList[indx];
    this.toggleEditEducationForm = !this.toggleEditEducationForm;
  }




  //delete icon
  deleteEduForm(indx: any) {
    this.staticAuditLogAPI('121', '');
    //if (confirm("Are you sure to delete? ")) {
    const message = `Are you sure you want to delete this education record?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      maxWidth: "800px",
      // height: 'calc(100% - 160px)',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.deleteconfirmresult = dialogResult;
      if (this.deleteconfirmresult) {
        this.showSpinner = true;
        let id = this.educationList[indx].userEducationID;
        let jsonObj = { userEducationID: id }
        this.staticAuditLogAPI('30', JSON.stringify(jsonObj));
        this.userService.deleteeducationrecord(id).subscribe((response: any) => {
          if (response && response.Status) {
            this.educationList.splice(indx, 1);
            console.log(this.educationList);
            this.updateCandData({ name: 'edu' });
            this.showSpinner = false;
          }
        }, (error => {

        }));

      } else {
        //console.log("NOoo")
        this.staticAuditLogAPI('122', '');
      }
    }); //
  }


  //@output event
  addEducation($event: Event) {
    console.log($event);
    this.educationList.push($event);
    this.toggleEducationForm = !this.toggleEducationForm;
    this.updateCandData({ name: 'edu' });
  }

  //@output event
  editEducation($event: Event) {
    console.log($event);
    this.educationList[this.educationEditIndex] = ($event);
    this.educationEditIndex = null;
    this.updateCandData({ name: 'edu' });
    // this.toggleEditEmployeeForm = !this.toggleEditEmployeeForm;
  }


  //close icon
  closeEducationForm(data: any) {
    if (data == 'edit') {
      this.educationEditIndex = null;
    } else {
      this.toggleEducationForm = false;
    }
  }


  /******* Summary */
  editSummaryForm(indx: any) {
    this.staticAuditLogAPI('16', '');
    this.SummaryEditIndex = indx;
    this.editedSummaryRecordData = this.SummaryList[indx];
    this.toggleEditSummaryForm = true;
  }

  addSummaryForm() {
    this.staticAuditLogAPI('16', '');
    this.toggleAddSummaryForm = !this.toggleAddSummaryForm;
  }

  // //@output event
  editSummary($event: Event) {
    console.log($event);
    this.SummaryList[this.SummaryEditIndex] = ($event);
    this.SummaryEditIndex = null;
    // this.toggleSummaryForm = true;
    this.toggleEditEmployeeForm = false;
    this.dataDecryption = (this.SummaryList[0].summaryDesc) ? this.auditlogService.decryptAES(this.SummaryList[0].summaryDesc) : '';
    this.summaryDesc = this.dataDecryption;
    this.toggleEditSummaryForm = !this.toggleEditSummaryForm;

    // this.toggleEditSummaryForm = false;
  }





  //*** Training *************************/

  //plus icon
  addTrainings() {
    this.staticAuditLogAPI('45', '');
    this.trainingEditIndex = null;
    this.editedTrainRecordData = null;
    this.toggleTrainingForm = !this.toggleTrainingForm;
  }

  addSocialLinks() {
    this.staticAuditLogAPI('52', '');
    this.socialLinkEditIndex = null;
    this.editedSLRecordData = null;
    this.toggleSocialLinkForm = !this.toggleSocialLinkForm;

  }

  addLanguages() {
    this.staticAuditLogAPI('59', '');
    this.languageEditIndex = null;
    this.editedLanguageRecordData = null;
    this.toggleLanguageForm = !this.toggleLanguageForm;

  }
  addLicenceCertificates() {
    this.staticAuditLogAPI('38', '');
    this.LCEditIndex = null;
    this.editedLCRecordData = null;
    this.toggleLCForm = !this.toggleLCForm;
  }

  addSkills() {
    this.staticAuditLogAPI('31', '');
    this.SkillsEditIndex = null;
    this.editedSkillsRecordData = null;
    this.toggleSkillsForm = !this.toggleSkillsForm;
  }

  addSummarys() {
    this.SummaryEditIndex = null;
    this.editedSummaryRecordData = null;
    this.toggleSummaryForm = !this.toggleSummaryForm;
  }


  //pencil icon
  editTrainForm(indx: any) {
    this.trainingEditIndex = indx;
    this.editedTrainRecordData = this.trainingList[indx];
    this.toggleEditTrainingForm = !this.toggleEditTrainingForm;
  }

  editSLForm(indx: any) {
    this.socialLinkEditIndex = indx;
    this.editedSLRecordData = this.socialLinksList[indx];
    this.toggleEditSocialLinkForm = !this.toggleEditSocialLinkForm;

  }

  editLanguageForm(indx: any) {
    this.languageEditIndex = indx;
    this.editedLanguageRecordData = this.languageList[indx];
    this.toggleEditLanguageForm = !this.toggleEditLanguageForm;

  }

  editLicenceCertificateForm(indx: any) {
    this.LCEditIndex = indx;
    this.editedLCRecordData = this.certficationList[indx];
    this.toggleEditLCForm = !this.toggleEditLCForm;
  }

  editSkillForm(indx: any) {
    this.SkillsEditIndex = indx;
    this.editedSkillsRecordData = this.skillsList[indx];
    this.toggleEditSkillsForm = !this.toggleEditSkillsForm;
  }

  // editSummaryForm(indx:any){
  //   this.SummaryEditIndex = indx;
  //   this.editedSummaryRecordData = this.SummaryList[indx];
  //   this.toggleEditSummaryForm = !this.toggleEditSummaryForm;
  // }

  //delete icon
  deleteTrainForm(indx: any) {
    this.staticAuditLogAPI('127', '');
    const message = `Are you sure you want to delete this training record?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      maxWidth: "800px",
      // height: 'calc(100% - 160px)',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.deleteconfirmresult = dialogResult;
      if (this.deleteconfirmresult) {
        this.showSpinner = true;
        let id = this.trainingList[indx].userTrainingID;
        let jsonObj = { userTrainingID: id }
        this.staticAuditLogAPI('51', JSON.stringify(jsonObj));
        this.userService.deletetrainingrecord(id).subscribe((response: any) => {
          if (response && response.Status) {
            this.trainingList.splice(indx, 1);
            console.log(this.trainingList);
            this.showSpinner = false;
          }
        }, (error => {

        }));
      } else {
        //console.log("NOoo")
        this.staticAuditLogAPI('128', '');
      }
    }); //
  }

  deleteSLForm(indx: any) {
    this.staticAuditLogAPI('135', '');
    const message = `Are you sure you want to delete this social link record?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      maxWidth: "800px",
      // height: 'calc(100% - 160px)',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.deleteconfirmresult = dialogResult;
      if (this.deleteconfirmresult) {
        this.showSpinner = true;
        let id = this.socialLinksList[indx].userSocialID;
        let jsonObj = { userSocialID: id }
        this.staticAuditLogAPI('58', JSON.stringify(jsonObj));
        this.userService.deletesociallinkrecord(id).subscribe((response: any) => {
          if (response && response.Status) {
            this.socialLinksList.splice(indx, 1);
            console.log(this.socialLinksList);
            this.updateCandData({ name: 'social' });
            this.showSpinner = false;
          }
        }, (error => {

        }));
      } else {
        //console.log("NOoo")
        this.staticAuditLogAPI('136', '');
      }
    }); //
  }

  deleteLanguageForm(indx: any) {
    this.staticAuditLogAPI('129', '');
    const message = `Are you sure you want to delete this language record ?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      maxWidth: "800px",
      // height: 'calc(100% - 160px)',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.deleteconfirmresult = dialogResult;
      if (this.deleteconfirmresult) {
        this.showSpinner = true;
        let id = this.languageList[indx].userLangID;
        let jsonObj = { userLangID: id }
        this.staticAuditLogAPI('65', JSON.stringify(jsonObj));
        this.userService.deletelanguagerecord(id).subscribe((response: any) => {
          if (response && response.Status) {
            this.languageList.splice(indx, 1);
            console.log(this.languageList);
            this.updateCandData({ name: 'lang' });
            this.showSpinner = false;
          }
        }, (error => {

        }));
      } else {
        //console.log("NOoo")
        this.staticAuditLogAPI('130', '');
      }
    }); //
  }

  deleteLicenceCertificateForm(indx: any) {
    this.staticAuditLogAPI('125', '');
    const message = `Are you sure you want to delete this license & certification record?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      maxWidth: "800px",
      // height: 'calc(100% - 160px)',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.deleteconfirmresult = dialogResult;
      if (this.deleteconfirmresult) {
        this.showSpinner = true;
        let id = this.certficationList[indx].userCertID;
        let jsonObj = { userCertID: id }
        this.staticAuditLogAPI('44', JSON.stringify(jsonObj));
        this.userService.deletecertificationrecord(id).subscribe((response: any) => {
          if (response && response.Status) {
            this.certficationList.splice(indx, 1);
            console.log(this.certficationList);
            this.updateCandData({ name: 'certi' });
            this.showSpinner = false;
          }
        }, (error => {

        }));
      } else {
        //console.log("NOoo")
        this.staticAuditLogAPI('126', '');
      }
    }); //
  }


  deleteSkillForm(indx: any) {
    this.staticAuditLogAPI('123', '');
    const message = `Are you sure you want to delete this skill record?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      maxWidth: "800px",
      // height: 'calc(100% - 160px)',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.deleteconfirmresult = dialogResult;
      if (this.deleteconfirmresult) {
        this.showSpinner = true;
        let id = this.skillsList[indx].userSkillID;
        let jsonObj = { userSkillID: id }
        this.staticAuditLogAPI('37', JSON.stringify(jsonObj));
        this.userService.deleteskillrecord(id).subscribe((response: any) => {
          if (response && response.Status) {
            this.skillsList.splice(indx, 1);
            console.log(this.skillsList);
            this.updateCandData({ name: 'skills' });
            this.showSpinner = false;
          }
        }, (error => {

        }));
      } else {
        //console.log("NOoo")
        this.staticAuditLogAPI('124', '');
      }
    }); //
  }




  //@output event
  addTraining($event: Event) {
    console.log($event);
    this.trainingList.push($event);
    this.toggleTrainingForm = !this.toggleTrainingForm;
    this.updateCandData({ name: 'train' });
  }

  addSocialLink($event: Event) {
    console.log($event);
    this.socialLinksList.push($event);
    this.toggleSocialLinkForm = !this.toggleSocialLinkForm;
    this.updateCandData({ name: 'social' });
  }

  addLanguage($event: Event) {
    console.log($event);
    this.languageList.push($event);
    this.toggleLanguageForm = !this.toggleLanguageForm;
    this.updateCandData({ name: 'lang' });
  }

  addLC($event: Event) {
    console.log($event);
    this.certficationList.push($event);
    this.toggleLCForm = !this.toggleLCForm;
    this.updateCandData({ name: 'certi' });
  }

  addSkill($event: Event) {
    console.log($event);
    this.skillsList.push($event);
    this.toggleSkillsForm = !this.toggleSkillsForm;
    this.updateCandData({ name: 'skills' });
  }

  addSummary($event: Event) {
    console.log($event);
    this.SummaryList.length = 0;
    this.SummaryList.push($event);
    this.toggleAddSummaryForm = false;
    this.dataDecryption = (this.SummaryList[0].summaryDesc) ? this.auditlogService.decryptAES(this.SummaryList[0].summaryDesc) : '';
    this.summaryDesc = this.dataDecryption;
  }


  //@output event
  editTraining($event: Event) {
    console.log($event);
    this.trainingList[this.trainingEditIndex] = ($event);
    this.trainingEditIndex = null;
    this.updateCandData({ name: 'train' });
    //this.toggleEditEmployeeForm = !this.toggleEditEmployeeForm;
  }

  //@output event
  editSocialLink($event: Event) {
    console.log($event);
    this.socialLinksList[this.socialLinkEditIndex] = ($event);
    this.socialLinkEditIndex = null;
    this.updateCandData({ name: 'social' });
    //this.toggleEditEmployeeForm = !this.toggleEditEmployeeForm;
  }

  //@output event
  editLanguage($event: Event) {
    console.log($event);
    this.languageList[this.languageEditIndex] = ($event);
    this.languageEditIndex = null;
    this.updateCandData({ name: 'lang' });
    //this.toggleEditEmployeeForm = !this.toggleEditEmployeeForm;
  }

  //@output event
  editLC($event: Event) {
    console.log($event);
    this.certficationList[this.LCEditIndex] = ($event);
    this.LCEditIndex = null;
    this.updateCandData({ name: 'certi' });
    //this.toggleEditEmployeeForm = !this.toggleEditEmployeeForm;
  }

  //@output event
  editSkill($event: Event) {
    console.log($event);
    this.skillsList[this.SkillsEditIndex] = ($event);
    this.SkillsEditIndex = null;
    this.updateCandData({ name: 'skills' });
    //this.toggleEditEmployeeForm = !this.toggleEditEmployeeForm;
  }

  //@output event
  // editSummary($event:Event){
  //   console.log($event);
  //   this.SummaryList[this.SummaryEditIndex] = ($event);
  //   this.SummaryEditIndex = null;
  //   //this.toggleEditEmployeeForm = !this.toggleEditEmployeeForm;
  // }

  // @output event close icon
  closeTrainingForm(data: any) {
    if (data == 'edit') {
      this.trainingEditIndex = null;
    } else {
      this.toggleTrainingForm = false;
    }
  }

  closeSLForm(data: any) {
    if (data == 'edit') {
      this.socialLinkEditIndex = null;
    } else {
      this.toggleSocialLinkForm = false;
    }
  }

  closeLanguageForm(data: any) {
    if (data == 'edit') {
      this.languageEditIndex = null;
    } else {
      this.toggleLanguageForm = false;
    }
  }

  closeLCForm(data: any) {
    if (data == 'edit') {
      this.LCEditIndex = null;
    } else {
      this.toggleLCForm = false;
    }
  }

  closeSkillForm(data: any) {
    if (data == 'edit') {
      this.SkillsEditIndex = null;
    } else {
      this.toggleSkillsForm = false;
    }
  }

  closeSummaryForm(data: any) {
    // this.toggleAddSummaryForm
    if (data == 'edit') {
      this.staticAuditLogAPI('111', '');
      this.SummaryEditIndex = null;
    } else {
      this.staticAuditLogAPI('111', '');
      this.toggleSummaryForm = false;
      this.toggleAddSummaryForm = !this.toggleAddSummaryForm;
    }
  }







  decryptIt(input: any) {
    return this.auditlogService.decryptAES(input);
  }


  filterName(val: any) {
    this.categoryList.filter((object: any) => {
      let arryLookList = object['lookupsList'];
      arryLookList.filter((object2: any) => {
        if (object2['lookupId'] == val) {
          this.lookupValueName = object2['lookupValue'];
        }
      });
    });
    return this.lookupValueName;
  }

  filterlangName(val: any) {
    this.languageName = '';
    if(val){
    this.masterLanguagesList.filter((object: any) => {
      if (object['languageCode'] == val) {
        this.languageName = object['languageName'];
      }
    });
      
    }
    return this.languageName;
  }
  empOrderChange(event: CdkDragDrop<string[]>) {
    // this.showSpinner = true;
    this.staticAuditLogAPI('133', '');
    moveItemInArray(this.employmentList, event.previousIndex, event.currentIndex);
    // console.log(this.employmentList);
    let tempid = 1;
    let sortedEmpList = this.employmentList.map(
      (choice: any) =>
      (
        { "userEmploymentId": choice.userEmploymentID, "orderBy": tempid++ }
      )
    );
    console.log(sortedEmpList);
    let toSend = {
      "userId": localStorage.getItem("userId"),
      "empList": sortedEmpList
    }
    this.userService.saveEmpOrder(toSend).subscribe(
      (response) => {
        // this.listTodos();
        console.log(response);
        // this.showSpinner = false;

      }, (error => {

      }));


  }
  loadPDF() {  
    // this.loadProfile = false;
    debugger
    this.showSpinner = true;
    // setTimeout(() => {
    //   // this.generatePDF?.loadInItData(this.candData);
    //   this.showSpinner = false;
    // }, 1000);
    // this.staticAuditLogAPI('101', '');

    
    
    let dataToPass = {
      "userId": localStorage.getItem("userId"),
      "htmlbody": this.htmlConvert.loadData(this.candData)
    }
    this.userService.htmltopdf(dataToPass, this.authToken).
      subscribe((response: any) => {
        this.showSpinner = false;
        if (response && response.Success) {
          FileSaver.saveAs(environment.amazonS3 + 'Sevron/' + response.path, response.path);

        } else {
          this.toastr.error(response.Message);
        }

      }, (error => {

      }));
  }
  pdfLoaded(e: any) {
    this.loadProfile = true;
  }

  profilePreview() {
    this.staticAuditLogAPI('100', '');
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/profilePreview'])
    );
    window.open(url, '_blank');
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


  onClickReplaceFile() {
    this.staticAuditLogAPI('98', '');
  }

  onClickProfilePicFile() {
    this.staticAuditLogAPI('95', '');
  }





}
