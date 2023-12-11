import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuditlogService } from '../shared/auditlog.service';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from '../class/emitters/emitters';
import { AssessmentCountService } from '../shared/services/assessment-count.service';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css']
})
export class AssessmentsComponent implements OnInit {

  assessments: any = [];
  dataSource: any;
  dataToPass: any;
  showSpinner: boolean = false;
  orderId: any;
  firstName: any;
  lastName: any;
  email: any;
  assessmentsId: any;
  pdfId: any;
  frontEndURL: any;
  badgesPath: any;
  @Input() isAssessmentList: any;
  @Output() shareAssessmentObjRec = new EventEmitter<any>();
  assessmentObjRec: any;
  assessmentCount = 0;
  totalAssessments = 0;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  constructor(private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    private router: Router,
    private countChange: AssessmentCountService,
    private actRoute: ActivatedRoute
  ) {

    this.badgesPath = environment.badgesPath;

  }

  getJobNumber() {
    // return Math.floor(Math.random() * (999 - 100 + 1) + 100);
    return (localStorage.getItem("jobNumber")) ? localStorage.getItem("jobNumber") : Math.floor(Math.random() * (999 - 100 + 1) + 100);
  }

  ngOnInit(): void {
    // this.orderId = this.randomString(10);

    
    this.actRoute.queryParams
      .subscribe(params => {
        // this.emailid = params.emailid ? params.emailid : '';
        var email = params.email ? params.email : '';
        if(email){
          localStorage.setItem('pageFrom', 'assessments');
          localStorage.setItem('emailFromMail', email);
        }
      });

    if (!this.userService.isUserLoggedIn()) {

      this.router.navigate(['/login']);
      Emitters.authEmitter.emit(false);
      return;
    } else {
      localStorage.removeItem('pageFrom');
      localStorage.removeItem('emailFromMail');
      this.staticAuditLogAPI('102', '');
      // Emitters.authEmitter.emit(true);

    }

    this.firstName = (localStorage.getItem('firstName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('firstName') || '{}')) : '';
    this.lastName = (localStorage.getItem('lastName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('lastName') || '{}')) : '';
    this.email = (localStorage.getItem('email') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('email') || '{}')) : '';

    this.frontEndURL = environment.FrontEndURLForUser;
    this.getAssessments();
    localStorage.setItem("jobNumber", Math.floor(Math.random() * (999 - 100 + 1) + 100) + '');
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
  }
  // assessmentsId: "JB-ACCUICKEVP"
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

  getMoreInformation(): string {
    return "Retake assessment is your last chance to improve your overall performance score and to get golden badge.\n A Candidate with maximum number of golden badges have higher chances of getting shortlisted by top employers.";
  }
  goToRecorder() {
    this.router.navigate(['/recorder'], { queryParams: { 'id': this.assessmentsId, 'oId': this.orderId } });
  }


  getAssessments() {
    this.showSpinner = true;
    this.userService.getAssessments().subscribe((response: any) => {
      this.showSpinner = false;

      if (response && response.Success) {
        this.assessments = response.candidateAssessments;
        // this.dataSource = response;
        // 10018003
        for (let i = 0; i < this.assessments.length; i++) {
          // this.dataSource[i].push('send');
          for (let j = 0; j < this.assessments[i].assessmentList.length; j++) {
            // this.dataSource[i].push('send');
            if (this.assessments[i].assessmentList[j].primaryAssessment) {
              this.totalAssessments++;
              if (this.assessments[i].assessmentList[j].count > 0) {
                this.assessmentCount++;
              }
            }
          }
        }
        this.countChange.updateCount(this.assessmentCount);
        this.countChange.updateTotal(this.totalAssessments);

        for (let i = 0; i < this.assessments.length; i++) {
          // this.dataSource[i].push('send');
          for (let j = 0; j < this.assessments[i].assessmentList.length; j++) {
            // this.dataSource[i].push('send');
            if (this.assessments[i].assessmentList[j].assessmentsId == localStorage.getItem('assessmentsId')) {
              this.assessmentObjRec = this.assessments[i].assessmentList[j];
              let typeObj = (this.assessmentObjRec.requiredBadgePath != '') ? true : false;
              this.countChange.updateAssessBadge(typeObj);
              this.countChange.updateAssessmentCount(this.assessmentObjRec.count);
              console.log(this.assessmentObjRec);
              break;
            }
          }
        }
        // assessmentsId
      }
      // this.assessments = 

    }, (error => {

    }));
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
