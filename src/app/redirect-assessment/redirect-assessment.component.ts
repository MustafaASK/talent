import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, NavigationStart,NavigationEnd, Event as NavigationEvent } from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { environment } from '../../environments/environment';
import { AuditlogService } from '../shared/auditlog.service';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AssessmentCountService } from '../shared/services/assessment-count.service';
// import { AssessmentsComponent } from './assessments/assessments.component';

@Component({
  selector: 'app-redirect-assessment',
  templateUrl: './redirect-assessment.component.html',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  styleUrls: ['./redirect-assessment.component.css']
})
export class RedirectAssessmentComponent implements OnInit {

  // locationurl : any = window.parent.location;

  location: Location;
  progressPercentage = 0;
  isGoldBadge = false;
  dataToPass:any;
  showSpinner: boolean = false;
  orderId: any;
  firstName: any;
  lastName: any;
  email: any;
  assessmentsId: any;
  pdfId: any;
  frontEndURL: any;
  isAssessmentList = true;
  isRecordSaved = false;
  assessData:any;
  totalAssessments= 0;
  compAssessments= 0;
  assessmentcount=0;
  canAssessmentListLoad = false;
  userId:any;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  constructor(location: Location, private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    private router: Router,
    private countChange: AssessmentCountService
    ) { this.location = location; }

  saveAssessmentRecord(){

    this.dataToPass = {
    "userId":this.userId,
    "orderId":this.orderId

    }
      // "sendCandidateEmail": true
    

    this.showSpinner = true;
    this.userService.savecandidateassessmentscore(this.dataToPass).subscribe((response) => {
      console.log(response);
      localStorage.setItem('isAssessmentCompleted', 'true');
      this.showSpinner = false;
      this.isRecordSaved = true;
      this.canAssessmentListLoad = true;
      // if (response && response.assessmentAccessURL) {
      //   // let ary = (response.assessmentAccessURL.uri.split('/'));
      //   // this.pdfId = (ary[ary.length - 1]);
      //   // this.saveAssessmentDatabase();

      //   // this.dialogRef.close((ary[ary.length -1]));

      // }
    }, (error => {
      this.showSpinner = false;
      this.isRecordSaved = true;

    }));
  }

  ngOnInit(): void {

    

    this.orderId = localStorage.getItem('orderId');
    this.userId= localStorage.getItem('userId');
    this.assessData = JSON.parse((localStorage.getItem('assessData') || '{}'));
    this.staticAuditLogAPI('147', JSON.stringify(this.assessData));
    if(!(localStorage.getItem('isAssessmentCompleted'))) {
      this.saveAssessmentRecord();

    } else {
      this.isRecordSaved = true;
      this.canAssessmentListLoad = true;
    }
    
    this.countChange.assessmentCount.subscribe(result => {
      this.compAssessments = result.count;
      // this.progressPercentage = parseInt(((result.count/this.totalAssessments)*100).toFixed(2));
      // this.progressPercentage =  (this.progressPercentage) ? this.progressPercentage : 0;
      console.log("complete : " + result);
    });
    this.countChange.assessmentTotalCount.subscribe(result => {
      this.totalAssessments = result.total;
      // this.progressPercentage = parseInt(((this.compAssessments/result.total)*100).toFixed(2));
      // this.progressPercentage =  (this.progressPercentage) ? this.progressPercentage : 0;
      console.log("totla : " +result);
      this.progressPercentage =  (this.compAssessments / this.totalAssessments) * 100;
    });
    
    this.countChange.assessmentGoldBadge.subscribe(result => {
      this.isGoldBadge = result.badge;
      console.log(result);
    });
    
    this.countChange.assessmentTotalSubObject.subscribe(result => {
      this.assessmentcount = result.assessmentcount;
      console.log(result);
    });
  }



  goToList(): void{

      this.staticAuditLogAPI('148', '');

      window.parent.postMessage({"for":"dashboard", "operation":"changeroute","route":"https://google.com"},'*')
  
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
