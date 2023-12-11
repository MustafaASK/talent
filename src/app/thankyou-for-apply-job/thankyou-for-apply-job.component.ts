import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuditlogService } from '../shared/auditlog.service';
import { RemoveJunkTextService } from '../shared/services/remove-junk-text.service';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-thankyou-for-apply-job',
  templateUrl: './thankyou-for-apply-job.component.html',
  styleUrls: ['./thankyou-for-apply-job.component.css']
})
export class ThankyouForApplyJobComponent implements OnInit {

  

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
  badgesPath:any;
  selectedJob = JSON.parse(localStorage.getItem("jobData") || '{}');
  @Input() isAssessmentList: any;  
  @Output() shareAssessmentObjRec = new EventEmitter<any>();
  assessmentObjRec:any;
  jobsDataLoad = false;


  itemsPerSlide = 2;
  noWrapSlides = false;
  showIndicator = false;
  myInterval = 5000000;


  jobsList: Job[] = [];

  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  constructor(private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    public rj: RemoveJunkTextService,
    private router: Router) {

    this.frontEndURL = environment.FrontEndURLForUser;
    this.badgesPath = environment.badgesPath;

  }


  getJobNumber(){
    return Math.floor(Math.random()*(999-100+1)+100);
  }

  applyJob() {
    let payrate = "";
    if(this.selectedJob.payrate){
      payrate = this.selectedJob.payrate;
    } else{
      if(this.selectedJob.payrange1){
        payrate = this.selectedJob.payrange1
      }
      if(this.selectedJob.payrange2){
        payrate += this.selectedJob.payrange2
      }
    }
    let dataToPass = {
      accuickJobId: this.selectedJob.jobid,
      userId: Number(localStorage.getItem('userId')),
      jobTitle: this.auditlogService.encryptAES(this.selectedJob.jobtitle),
      clientName: this.auditlogService.encryptAES(this.selectedJob.compname),
      city: this.auditlogService.encryptAES(this.selectedJob.city),
      state: this.auditlogService.encryptAES(this.selectedJob.state),
      zipcode: this.auditlogService.encryptAES(this.selectedJob.zipcode),
      payRate: this.auditlogService.encryptAES(payrate),
      jobType: this.auditlogService.encryptAES(this.selectedJob.jobtype),
      description: this.auditlogService.encryptAES(this.selectedJob.description),
      source: ((localStorage.getItem('source') || '{}') ? (localStorage.getItem('source') || '{}') : 'cxninja')
    }
    this.showSpinner = true;


    

    this.userService.applyJob(dataToPass).
      subscribe((response: any) => {
        this.showSpinner = false;
        localStorage.removeItem('source');
        // if (response && response.Status == 401) {
        //   this.toastr.error(response.Message);
        // }
        // if (response && response.Status) {
        //   if (response.Error){
        //     this.toastr.error(response.Message);
        //   }else{
        //     this.jobsList[this.selectedIndex].applied = true;
        //     this.selectedJob.applied = true;
        //     if (response.Message.includes('already')) {
        //       this.toastr.info(response.Message);
        //     } else {
        //       this.toastr.success(response.Message);
        //     }
        //   }
        //  console.log(response);
        // }

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

  ngOnInit(): void {
    // this.orderId = this.randomString(10);
    this.firstName = (localStorage.getItem('firstName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('firstName') || '{}')) : '';
    this.lastName = (localStorage.getItem('lastName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('lastName') || '{}')) : '';
    this.email = (localStorage.getItem('email') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('email') || '{}')) : '';

    this.getAssessments();
    this.applyJob();
    localStorage.removeItem("pageFrom");
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
    localStorage.setItem('orderId', this.orderId);
    localStorage.setItem('assessmentsId', obj.assessmentsId);
    localStorage.setItem('assessData',JSON.stringify(obj));
    this.assessmentsId = obj.assessmentsId;
    // return;
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
        this.goToAssessment();
      }

    }, (error => {

    }));
  }

  goToAssessment() {
    this.router.navigate(['/assessment'], { queryParams: { 'id': this.pdfId, 'oId': this.orderId } });

  }

  getMoreInformation(): string{
    return "Retake assessment is your last chance to improve your overall performance score and to get golden badge.\n A Candidate with maximum number of golden badges have higher chances of getting shortlisted by top employers.";
  }

  goToJobList(id:any){
    if(this.userService.getToken()){
       //this.staticAuditLogAPI('154', '');
      this.router.navigate(['/jobs'], { queryParams: {'jobId': id } });
   }else{
      //this.router.navigate(['/find-jobs'])
      this.router.navigate(['/find-jobs'], { queryParams: {'jobid': id } });
 
    }
 }


  getAssessments() {

   this.showSpinner = true;
    this.userService.getreviewdetails().subscribe((response: any) => {
      this.showSpinner = false;

      if (response && response.Success) {
          // this.assessmentsList = response.assessmentsList;
        // this.assessments = response.assessmentsList;
        for(let i=0; i<response.assessmentsList.length; i++){
          if(response.assessmentsList[i].count<1){
            this.assessments.push(response.assessmentsList[i]);
          }
        }

        if(!this.assessments.length){
          this.staticAuditLogAPI('153', '');
          this.getRecommendJobs();
         }else{
           this.staticAuditLogAPI('152', '');
         }
      
         // this.dataSource = response;
         // let 
        // for(let i=0; i<this.assessments.length; i++){
        //   // this.dataSource[i].push('send');
        //   for(let j=0; j<this.assessments[i].assessmentList.length; j++){
        //     // this.dataSource[i].push('send');
        //     if(this.assessments[i].assessmentList[j].assessmentsId == localStorage.getItem('assessmentsId')){
        //       this.assessmentObjRec = this.assessments[i].assessmentList[j];
        //       console.log(this.assessmentObjRec)
        //       break;
        //     }
        //   }
        // }
        // assessmentsId
      }
      // this.assessments = 

    }, (error => {

    }));
  }

  goToList(){
    this.staticAuditLogAPI('154', '');
    this.router.navigate(['/dashboard']);

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
