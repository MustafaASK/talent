import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF, RGBAData } from 'jspdf';
import html2canvas from 'html2canvas';
import { RemoveJunkTextService } from 'src/app/shared/services/remove-junk-text.service';
// import { Router } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from 'src/app/user-auth.service';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
// @ts-ignore
import domtoimage from 'dom-to-image';

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrls: ['./show-profile.component.css'],
  // encapsulation: true
})
export class ShowProfileComponent implements OnInit {

  constructor(
    // public dialog: MatDialog,
    // public dialogRef: MatDialogRef<ShowProfileComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserAuthService,
    private router: Router,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    public removeJunk: RemoveJunkTextService,
    public domSanitizer: DomSanitizer,
    private actRoute: ActivatedRoute
  ) {
    this.badgesPath = environment.badgesPath;
    // this.actRoute.params.subscribe( params => this.userId = params.id );
     }

  @ViewChild('profileDetails', { static: false }) profileDetails: ElementRef | undefined;
  @Input() dataToPass: any;
  @Output() dataToParent = new EventEmitter<any>();

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
    empHistory: [
      {
        jobTitle: '',
        companyName: '',
        startDate: '',
        currentCompany: '',
        endDate: '',
        workAddress: '',
        empResponsibilities: ''
      }
    ],
    education: [
      {
        degreeName: '',
        degreeType: '',
        degreeCompletionDate: '',
        schoolName: ''
      }
    ],
    skills: [
      {
        skillName: '',
        skillValue: ''
      }
    ],
    socialsLinks: [{
      socialURL: '',
      socialValue: '',
    }
    ],
    languages: [{
      langName: '',
      langValue: ''
    }
    ],
    certficationList: [{
      certName: '',
      completedYear: '',
      authorityName: '',
    }
    ],
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
  resumeData = {
    name: '',
    path: '',
    date: '',
    pdfDown: ''
  }
  showPreviewBtn = false;
  profilePicId = '';
  empHistoryElements = '';
  educationElements = '';
  skillsElements = '';
  socialsLinksElements = '';
  languagesElements = '';
  certificateElements = '';
  TrainingElements = '';
  htmlContent: any;
  pageCtx: any;
  categoryListLoaded = false;
  masterLanguagesListLoaded = false;
  reviewdetailsLoaded = false;
  reviewdetailsForPdfLoaded = false;
  preferencesLoaded = false;
  categoryList: any;
  masterLanguagesList: any = [];
  showSpinner = false;
  employmentList: any = [];
  trainingList: any = [];
  languageList: any = [];
  certficationList: any = [];
  TrainingList: any = [];
  skillsList: any = [];
  educationList: any = [];
  socialLinksList: any = [];
  SummaryList: any = [];
  summaryDesc: any;
  dataDecryption: any;
  profileImageBase64: any;
  userId:any;

  isImageLoaded = false;
  loadPdf = false;
  badgesPath:any;
  assessmentsList: any = [];
  assessmentsReportsList:any;
  graphimagePath:any;

  goldBadges : any = [];
  starNinja:boolean = false;



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
  
  loadHtml(obj: any) {
    this.candData = JSON.parse(obj);
    this.candData.careersummary = this.removeJunk.addPrintBreaks(this.candData.careersummary);

    // (this.candData.legalUS == 1) ? 'Yes' : (this.candData.legalUS == 2) ? 'No' : '';
    // (this.candData.requireVisa == 1) ? 'Yes' : (this.candData.requireVisa == 2) ? 'No' : '';


    this.candData.legalUS = (Number(this.candData.legalUS) == 1) ? 'Yes' : (Number(this.candData.legalUS) == 2) ? 'No' : '';
    this.candData.requireVisa = (Number(this.candData.requireVisa) == 1) ? 'Yes' : (Number(this.candData.requireVisa) == 2) ? 'No' : '';

    this.empHistoryElements = '';
    this.candData.empHistory.forEach((el: any) => {
      el.empResponsibilities = this.removeJunk.addPrintBreaks(el.empResponsibilities.replace(/\r\n/g, '<br>'))
    });
    this.educationElements = ``;
    this.candData.education.forEach((el: any) => {
      this.educationElements += `<li class="innerpadding">
          <div class="companydata">
              <h4>${el.degreeName} | ${el.degreeType} <span class="years float-right">${el.degreeCompletionDate.substring(0, 4)}</span>
              </h4>
              <span class="subheading">${el.schoolName}</span>
          </div>
      </li>`;
    });
    this.certificateElements = '';
    this.candData.certficationList.forEach((el: any) => {
      this.certificateElements += ``;
      // certValue: "License"
    });

    this.TrainingElements = '';
    this.candData.trainingList.forEach((el: any) => {
      this.TrainingElements += ``;
      // certValue: "License"
    });

    this.skillsElements = ``;
    this.candData.skills.forEach((el: any) => {
      this.skillsElements += `<li>
          <span class="skillname">${el.skillName}</span>
          <span class="skillrating float-right" >
            ${(el.skillValue) ? ' | ' + el.skillValue : ''}
          </span>
      </li>`;
      // isManual: false
      // skillID: 79
      // skillLevelID: 10004002
      // skillName: "adobe xd"
      // skillValue: "Intermediate"
      // userId: 34
      // userSkillID: 1041
    });
    this.socialsLinksElements = ``;
    this.candData.socialsLinks.forEach((el: any) => {
      // <i class="fas fa-basketball-ball"></i>
      this.socialsLinksElements += ``;
    });
    this.languagesElements = ``;
    this.candData.languages.forEach((el: any) => {
      this.languagesElements += `<li>
          <span class="skillname">${el.langName}</span>
          <span class="tag">${el.langValue}</span>
      </li>`;
    });
  }

  public async generatePDF1() {
    const element = document.getElementById('wrapperDivPdf');
    const opt = {
      margin: 0.2,
      filename: this.candData.firstName + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
      pageSize: [8.5, 11]
    };

    html2pdf().set(opt).from(element).save();

  }
  generatePDF2() {
    // create temporary element to insert the html string and sanitize the html to make it readable
    let reportInHtmlElem = document.createElement('div');

    // we hide it from the user view
    reportInHtmlElem.style.visibility = 'hidden';

    // below method of inserting html expose to possible XSS security issues but it's the only method i've 
    // found that is working to insert my html content 
    // + my html inserted here is created by my rich text editor which is safe
    // reportInHtmlElem.innerHTML += this.reportInHtml;

    reportInHtmlElem.innerHTML += (this.profileDetails) ? this.profileDetails.nativeElement.innerHTML : '';
    document.body.appendChild(reportInHtmlElem);
    this.htmlContent = (this.profileDetails) ? this.profileDetails.nativeElement : '';


    // reportInHtmlElem = this.insertBreaks(reportInHtmlElem);

    // const opt = {
    //   margin: 0.2,
    //   filename: this.candData.firstName + '.pdf',
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    //   pagebreak: { mode: ['css', 'legacy'] },
    //   pageSize: [8.5, 11]
    // };
    // var opt = {
    //   margin: 0.8,
    //   filename: this.candData.firstName + '.pdf',
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2, letterRendering: true },
    //   jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    //   pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    // };
    var opt = {
      margin: 10,
      filename: this.candData.firstName + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { dpi: 300, letterRendering: true, scale: 2 }, // , width: 1080, height: 1920
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      // pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      // pagebreak:    { mode: 'avoid-all', before: '#page2el' }
      pagebreak: { mode: ['avoid-all', 'css', 'legacy', 'whiteline'] }
    };

    // html2pdf().from(reportInHtmlElem).set(opt).toPdf().get('pdf').then(function (pdfObject: any) {
    html2pdf().from(this.htmlContent).set(opt).toPdf().get('pdf').then(function (pdfObject: any) {
      // // function to insert the header img
      // // get the number of pages in the pdf
      // let pdf_pages = pdfObject.internal.pages;
      // let headerImg = 'myImg';

      // // We are telling our pdfObject that we are now working on this page
      // // pdfObject.setPage(i);
      // // then we put our img header
      // pdfObject.addImage(headerImg, 0, 0, 0, 0);
    }).save();

    // make it visible back
    reportInHtmlElem.style.visibility = 'visible';
    // remove temporary element
    document.body.removeChild(reportInHtmlElem);
  }

  generatePDF() {
    // let ele = document.getElementsByTagName("body");
    // ele[0].style.minWidth = "1200px";
    this.showSpinner = true;
    // if (this.loadPdf) {
      // this.showSpinner = false;
    // }
    // setTimeout(() => {
      // this.showSpinner = false;
      // this.dataToParent.emit(true);
    // }, 4500);

    // setTimeout(() => {

    var node = document.getElementById('wrapperDivPdf');

    var img: HTMLImageElement;
    var filename = this.candData.firstName + '.pdf';
    var newImage: string | HTMLImageElement | HTMLCanvasElement | Uint8Array | RGBAData;
    var globalThisForPdf = this;


    domtoimage.toPng(node, { bgcolor: '#f3f5f7' })

      .then(function (dataUrl: string) {

        img = new Image();
        img.src = dataUrl;
        newImage = img.src;

        img.onload = function () {

          var pdfWidth = img.width;
          var pdfHeight = img.height;

          // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

          var doc;

          if (pdfWidth > pdfHeight) {
            doc = new jsPDF('l', 'px', [pdfWidth, pdfHeight], true);
            // var doc = new jsPDF('p', 'pt','a4',true);
          }
          else {
            doc = new jsPDF('p', 'px', [pdfWidth, pdfHeight], true);
          }


          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();


          doc.addImage(newImage, 'PNG', 10, 10, width, height);
          doc.save(filename);
          // debugger;
          globalThisForPdf.showSpinner = false;
          globalThisForPdf.dataToParent.emit(true);
          // ele[0].style.minWidth = "auto";
        };


      })
      .catch(function (error: any) {

        // ele[0].style.minWidth = "auto";
        // Error Handling

      });

    // }, 1000);


  }


  public async generatePDF3() {
    this.showSpinner = true;
    // create temporary element to insert the html string and sanitize the html to make it readable


    // this.htmlContent = (this.profileDetails) ? this.profileDetails.nativeElement : '';
    // let element  = this.insertBreaks(document.getElementById('wrapperDivPdf'));
    // this.htmlContent = (this.profileDetails) ? this.insertBreaks(this.profileDetails.nativeElement) : '';
    this.htmlContent = (this.profileDetails) ? this.profileDetails.nativeElement : '';
    // reportInHtmlElem.innerHTML += (this.profileDetails) ? this.profileDetails.nativeElement.innerHTML : '';

    // this.htmlContent = reportInHtmlElem;
    html2canvas(this.htmlContent, { useCORS: true, allowTaint: true, scrollY: 0 }).then((canvas) => {
      const image = { type: 'jpeg', quality: 0.98 };
      const margin = [0.2, 0.2];
      const filename = 'myfile.pdf';

      var imgWidth = 8.5;
      var pageHeight = 11;

      var innerPageWidth = imgWidth - margin[0] * 2;
      var innerPageHeight = pageHeight - margin[1] * 2;

      // Calculate the number of pages.
      var pxFullHeight = canvas.height;
      var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      var nPages = Math.ceil(pxFullHeight / pxPageHeight);

      // Define pageHeight separately so it can be trimmed on the final page.
      var pageHeight = innerPageHeight;

      // Create a one-page canvas to split up the full image.
      var pageCanvas = document.createElement('canvas');
      this.pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      // Initialize the PDF.
      var pdf = new jsPDF('p', 'in', [8.5, 11]);

      for (var page = 0; page < nPages; page++) {
        // Trim the final page to reduce file size.
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        // Display the page.
        var w = pageCanvas.width;
        var h = pageCanvas.height;
        this.pageCtx.fillStyle = 'white';
        this.pageCtx.fillRect(0, 0, w, h);
        this.pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

        // Add the page to the PDF.
        if (page > 0) pdf.addPage();
        // debugger;
        var imgData = pageCanvas.toDataURL('image/' + image.type, image.quality);
        pdf.addImage(imgData, image.type, margin[1], margin[0], innerPageWidth, pageHeight);
      }

      pdf.save(this.candData.firstName);
      // this.candData.profilePicPath1 = '';
      this.showSpinner = false;
      setTimeout(() => {
        this.dataToParent.emit(true);
      }, 1000);
    });
    // if (!this.isImageLoaded) {
    //   setTimeout(() => {
    //     this.generatePDF();
    //   }, 1000);
    //   return;
    // }
    // this.candData.profilePicPath = this.candData.profilePicPath + '?origin='+ window.location.host;
    // t.candData.profilePicPath = t.candData.profilePicPath + '?v=1'
    // if (this.candData.profilePicPath) {
    //   this.candData.profilePicPath1 = this.candData.profilePicPath + "?v=" + new Date().getTime();
    // } else {
    //   this.candData.profilePicPath1 = '';
    // }
    // const timestamp = new Date().getTime();
    // this.candData.profilePicPath = this.candData.profilePicPath.includes('?') ? `${this.candData.profilePicPath}&v=${timestamp}` : `${this.candData.profilePicPath}?v=${timestamp}`;

    // setTimeout(() => {
    // html2canvas(this.htmlContent).then(canvas => {
    //   const contentDataURL = canvas.toDataURL('image/png')
    //   // let pdf = new jsPDF('l', 'cm', 'a4'); //Generates PDF in landscape mode
    //   // // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
    //   // pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
    //   // pdf.save('Filename.pdf');



    //   var imgData = canvas.toDataURL('image/png');
    //   var imgWidth = 210;
    //   var pageHeight = 295;
    //   var imgHeight = canvas.height * imgWidth / canvas.width;
    //   var heightLeft = imgHeight;
    //   var doc = new jsPDF('p', 'mm');
    //   var position = 0;

    //   doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;

    //   while (heightLeft >= 0) {
    //     position = heightLeft - imgHeight;
    //     doc.addPage();
    //     doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //   }
    //   doc.save('file.pdf');
    // });

    // const doc1 = new jsPDF('p', 'pt', 'a4');
    // const div = (this.profileDetails) ? this.profileDetails.nativeElement : ''
    // await html2canvas(div).then(canvas => {
    //   // Few necessary setting options
    //   const imgWidth = 208; // your own stuff to calc the format you want
    //   const imgHeight = canvas.height * imgWidth / canvas.width; // your own stuff to calc the format you want
    //   const contentDataURL = canvas.toDataURL('image/png');
    //   // page.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    //   doc1.save('test.pdf'); // save / download
    //   // doc1.output('dataurlnewwindow'); // just open it
    // });


    // const doc = new jsPDF();

    // // const specialElementHandlers = {
    // //   '#editor': function (element: any, renderer: any) {
    // //     return true;
    // //   }
    // // };

    // const pdfTable = (this.profileDetails) ? this.profileDetails.nativeElement : '';

    // doc.html(pdfTable.innerHTML, {
    //   width: 190
    // });

    // doc.save('tableToPdf.pdf');
    // }, 250);
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
        // this.toastr.error(response.message);
        this.userService.categoryList = response.CategoryList;
        this.categoryList = response.CategoryList;
      }

      if (!this.reviewdetailsLoaded) {
        this.profilepreview();
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
          this.profilepreview();
        }
      }
    }, (error => {
    }));
  }

  profilepreview() {
    this.reviewdetailsLoaded = true;
    // console.log(this.loginForm.value);    
    // this.userId = localStorage.getItem("profileId");
    this.showSpinner = true;
    this.userService.profilepreview(this.userId).subscribe((response: any) => {
      this.showSpinner = false;
      this.reviewdetailsForPdfLoaded = true;
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
        // this.assessmentsList = response.assessmentsList;
        //   for(let i=0;i<this.assessmentsList.length; i++){
        //     if(this.assessmentsList[i].requiredBadgePath.toLowerCase().indexOf('gold') != '-1'){
        //       this.goldBadges.push(this.assessmentsList[i]);
        //     }
        //   }
          // this.isNinja();

         
          if (response.assessmentsReportsList && response.assessmentsReportsList.length && response.assessmentsReportsList['0'].assessmentReportURL != '') {
                // this.graphimagePath = environment.amazonS3 + 'Sevron/' +response.assessmentsReportsList['0'].assessmentReportURL;
                this.graphimagePath = response.assessmentsReportsList['0'].assessmentReportURL;
                this.assessmentsReportsList = true;
          }else{
               this.assessmentsReportsList = false;
          }
    
        this.employmentList = response.employmentList;
        console.log(this.employmentList);
        for (let e = 0; e < this.employmentList.length; e++) {
          let eventEndTime = (moment(this.employmentList[e].endDate).format('MMM-YYYY'));
          let eventStartTime = (moment(this.employmentList[e].startDate).format('MMM-YYYY'));
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



        if (this.loadPdf && this.preferencesLoaded && this.reviewdetailsForPdfLoaded) {
          this.showSpinner = true;
          setTimeout(() => {
            this.generatePDF();
          }, 1000);
        }
        this.getPreferences();





      }

    }, (error => {

    }));
  }

  getPreferences() {
    this.showSpinner = true;
     /***** profile Id */
     var profileId = localStorage.getItem('profileId');
     if (typeof profileId !== 'undefined' && profileId !== null){
        this.userId = localStorage.getItem("profileId");
     }
    this.userService.getprofilepreferencelist(this.userId).subscribe((response: any) => {
      this.showSpinner = false;
      if (response && response.Success) {
          this.preferencesLoaded = true;
        if ((response.preferenceList && response.preferenceList.length)) {
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

          this.candData.legalUS = (response.preferenceList[0].legalStatus == 1) ? 'Yes' : (response.preferenceList[0].legalStatus == 2) ? 'No' : '';
          this.candData.requireVisa = (response.preferenceList[0].visaSponsorStatus == 1) ? 'Yes' : (response.preferenceList[0].visaSponsorStatus == 2) ? 'No' : '';


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

          if (this.loadPdf && this.preferencesLoaded && this.reviewdetailsForPdfLoaded) {
            this.showSpinner = true;
            setTimeout(() => {
              this.generatePDF();
            }, 1000);
          }
        this.showPreviewBtn = true;
      }

    }, (error => {

    }));
  }
  getImage(url: string) {
    // this.showSpinner = true;
    // this.userService.imageUrlToBase64(url).subscribe(
    //   base64 => {
    //     // this.profileImageBase64 = 'data:image/png;base64,' + base64;
    //     this.showSpinner = false;
    //     console.log(this.profileImageBase64);
    //     this.isImageLoaded = true;
    //   })
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
  loadInItData(obj: any) {
    this.reviewdetailsLoaded = false;
    this.preferencesLoaded = false;
    this.masterLanguagesListLoaded = false;
    this.categoryListLoaded = false;
    this.candData = obj;
    this.loadPdf = true;
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
      this.profilepreview();
    }

    this.profileImageBase64 = this.candData.profilePicPath ? (this.domSanitizer.bypassSecurityTrustResourceUrl((this.candData.profilePicPath) ? (this.candData.profilePicPath).toString() : '')) : '';
    // setTimeout(() => {
    //   this.generatePDF();
    // }, 500);
  }
  insertBreaks(element: any) {
    let currentPageHeight = 0;
    // this mawPageHeight depends of the dpi of your pdf, your format, etc.
    let maxPageHeight = 650;
    // select all elements from our created html element which contains our text
    let allElem = element.getElementsByClassName('toAddBreak');

    // iterate through the elements to calculate the height and then avoid height repetition from 
    // elements within other elements by setting their height to 0
    for (let i = 2; i < allElem.length; i++) {
      // allElem[i].tagName   'SECTION'

      // get the height of each element
      let lineHeight = allElem[i].offsetHeight;

      if (allElem[i].tagName === 'TBODY') {
        lineHeight = 0;
      }
      else if (allElem[i].tagName === 'UL') {
        lineHeight = 0;
      }
      else if (allElem[i].tagName === 'TABLE') {
        lineHeight = 0;
      }
      else if (allElem[i].tagName === 'DIV') {
        lineHeight = 0;
      }
      else if (allElem[i].tagName === 'TD') {
        lineHeight = 0;
      }
      else if (allElem[i].tagName === 'SPAN') {
        lineHeight = 0;
      }
      else if (allElem[i].tagName === 'STRONG') {
        lineHeight = 0;
      }
      else if (allElem[i].tagName === 'U') {
        lineHeight = 0;
      }
      else if (allElem[i].tagName === 'EM') {
        lineHeight = 0;
      }
      else if (allElem[i].tagName === 'P' && allElem[i].parentElement.tagName === 'TD') {
        lineHeight = 0;
      }

      // calculate the total height
      currentPageHeight = currentPageHeight + lineHeight;

      if (currentPageHeight > maxPageHeight) {
        currentPageHeight = 0;
        // insert an html page break when max height page is reached
        allElem[i].insertAdjacentHTML('beforebegin', '<div class="html2pdf__page-break"></div>');
      }
    }
    return element;
  }
  ngOnInit(): void {

   // this.graphimagePath = "http://localhost:4400/assets/badge/349_graph.png";

    // this.graphimagePath = environment.amazonS3 + "Sevron/349_graph.png";

    this.actRoute.paramMap
      .subscribe(params => {
        // this.emailid = params.emailid ? params.emailid : '';
        // debugger;
        // console.log(params.get('id'));
        var userid = params.get('id');
        // debugger
        this.userId = userid ? userid : localStorage.getItem("profileId");
        // localStorage.setItem('userId',this.userId);
        
        
      });
    // const candData = localStorage.getItem('candidateData');
    // this.loadHtml(candData);
    // this.profileImageBase64 = this.domSanitizer.bypassSecurityTrustResourceUrl(this.userService.base64);
    // this.candData = this.dataToPass;
    if (this.dataToPass) {
      this.loadPdf = true;
      //   // this.getImage();
      //   setTimeout(() => {
      //     // this.generatePDF();
      //   }, 1000);
    } else {
      // this.loadInItData(false);
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
        this.profilepreview();
      }
    }
  }

}
