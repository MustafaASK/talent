import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from '../class/emitters/emitters';
import { ShowJobComponent } from '../common-component/modals/show-job/show-job.component';
import { AuditlogService } from '../shared/auditlog.service';
import { RemoveJunkTextService } from '../shared/services/remove-junk-text.service';
import { environment } from 'src/environments/environment';
import { UserAuthService } from '../user-auth.service';
import { FilterPipe } from '../pipes/filter.pipe';
import { debug } from 'console';
import { AssessmentCountService } from '../shared/services/assessment-count.service';
import { ShowApplyJobComponent } from '../common-component/modals/show-apply-job/show-apply-job.component';
import { BasicInfoNotFoundComponent } from '../common-component/modals/basic-info-not-found/basic-info-not-found.component';


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
export interface JobType {
  lookupId: number
  lookupScreenDesc: string
  lookupValue: string
}
export interface AssessmentRequired {
  id: number
  name: string
}
export interface AppliedJob {
  accuickJobId: number;
  city: string;
  clientName: string;
  jobTitle: string;
  state: string;
  userId: number;
  userJobId: number;
  zipcode: string;
  isChecked: Boolean;
  payrange: string;
  payrange1: Number | string;
  payrange2: Number | string;
  payRate: string;
  paytype: string;
  jobType: string;
  description: string;
  appliedDate: string;
}

@Component({
  selector: 'app-apply-jobs',
  templateUrl: './apply-jobs.component.html',
  styleUrls: ['./apply-jobs.component.css']
})
export class ApplyJobsComponent implements OnInit {

  jobsTab = true;
  jobForm: FormGroup;
  jobsList: Job[] = [];
  jobtypes: JobType[] = [];
  jobsAppliedList: AppliedJob[] = [];
  myRequiredAssessments: AssessmentRequired[] = [];
  file: File[] = [];
  fileExt = '';
  selectedJob: any;
  showSpinner = false;
  searched = false;
  selectedIndex: number = 0;
  errorTxt = 'No Recommended Jobs Found';
  isMobile = false;
  filtersHide = true;
  jobIdFromMail = null;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  assessmentsAry: any;
  badgesPath: any;
  jobIdToLoad = '';
  keyWordData='';
    loginForm:any;
    submitted = false;
    hide = true;
    color = "accent";
    emailId:any;
    redirectTo:any;
  
  logoUrl = environment.baseUrl + "candidates";
  emailEmpty = false;
  firstNameEmpty = false;
  lastNameEmpty = false;
  isAlreadyOldUser = false;
  color1 = 'primary';


  constructor(
    public dialog: MatDialog,
    private formBuild: FormBuilder,
    private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    public rj: RemoveJunkTextService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private countChange: AssessmentCountService
  ) {
    // if(this.actRoute.snapshot.params.id){
    //   this.jobIdFromMail = this.actRoute.snapshot.params.id;
    //   localStorage.setItem('mailJobId', this.actRoute.snapshot.params.id);
    // }

    this.badgesPath = environment.badgesPath;
    this.jobForm = formBuild.group({
      // candname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      // status: ['', Validators.required],
      keyWords: [''],
      location: [''],
      jobType: [''],
      hours: [''],
      payRate: ['']

    });
  }
  getJobs(type: any) {

    this.errorTxt = 'No Jobs Found';
    this.searched = false;
    this.selectedJob = '';
    this.jobsList = [];

    if (type == 'keyWords') {
      this.staticAuditLogAPI('104', '');
    }
    if (type == 'location') {
      this.staticAuditLogAPI('105', '');
    }
    if (type == 'jobtype') {
      this.staticAuditLogAPI('106', '');
    }
    if (type == 'payrate') {
      this.staticAuditLogAPI('107', '');
    }



    let dataToPass = {
      "keyWords": this.jobForm.value.keyWords,
      "location": (this.jobForm.value.location != "0") ? this.jobForm.value.location : '',
      "jobType": (this.jobForm.value.jobType != "0") ? this.jobForm.value.jobType : '',
      "hours": (this.jobForm.value.hours != "0") ? this.jobForm.value.hours : '',
      "payRate": (this.jobForm.value.payRate != "0") ? this.jobForm.value.payRate : '',
      "next": "0",
      "userId": Number(localStorage.getItem('userId'))
    }
    this.showSpinner = true;
    this.userService.getJobsSearchList(dataToPass).
      subscribe((response: any) => {
        this.showSpinner = false;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Match.length) {

          console.log(response);

          this.searched = true;
          if (response.Match.length) {
            // const tobeSelJob = this.jobIdToLoad;
            // response.Match.forEach(function (item: any, i: number) {
            //   if (item.jobid == tobeSelJob) {
            //     response.Match.splice(i, 1);
            //     response.Match.unshift(item);
            //   }
            // });
            response.Match.forEach((el: any) => {
              el.applied = false;
              el.date = this.userService.getDateFormat(el.date);
              el.description = this.rj.removeJunk(el.description)
              el.descShort = this.rj.removeJunk(el.description.replace(/\r\n/g, ' ').replace(/<br \/>/g, ' '))
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
            this.selectedIndex = 0;
            this.selectedJob = response.Match[0];

            this.jobsAppliedList.forEach(jobApp => {
              response.Match.forEach((el: any) => {
                if (jobApp.accuickJobId == Number(el.jobid)) {
                  el.applied = true;
                }
              });
            });
          }
          this.jobsList = response.Match;
        } else {
          
          this.jobsList = response.Match;
        }

      }, (error => {

      }));
  }

    goToResumeBuilder(){

            localStorage.setItem("isUploadResumeStatus","null");
            this.router.navigate(['/resume-builder']);
    }


  onSelectFile(event: any,element:any) {
    console.log(event);
    
        

console.log(this.selectedJob);
        // return;


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

        // formData.append("userId", userId);
        formData.append("resume", this.file[0]);
        formData.append("source", ((localStorage.getItem('source') || '{}') ? (localStorage.getItem('source') || '{}') : 'cxninja'));
        formData.append("sourceLookupId" , '10002002' );
        formData.append("communityId", '1000'); 
        formData.append("status", this.auditlogService.encryptAES(this.selectedJob.status)); 
        formData.append("accuickJobId", this.selectedJob.jobid);
        formData.append("jobTitle", this.auditlogService.encryptAES(this.selectedJob.jobtitle));
        formData.append("clientName", this.auditlogService.encryptAES(this.selectedJob.compname));
        formData.append("city", this.auditlogService.encryptAES(this.selectedJob.city));
        formData.append("state", this.auditlogService.encryptAES(this.selectedJob.state));
        formData.append("zipcode", this.auditlogService.encryptAES(this.selectedJob.zipcode));
        formData.append("payRate", this.auditlogService.encryptAES(payrate));
        formData.append("jobType", this.auditlogService.encryptAES(this.selectedJob.jobtype));
        formData.append("description", this.auditlogService.encryptAES(this.selectedJob.description));


//         "email":"3FIC8E/HYXW773ZThGxyM1CQAvOJwwDldFCVORBEQGg=",
// "password":"OSwg5GbFMEmntac5KWntDA==",
// "firstName":"qUd1tEL9vA2R3htYZXMZgg==",
// "lastName":"Vd3iOAMSCUkdJLdhtj1WuA==",
// "source":"accuick",
// "sourceLookupId":10002002,
// "communityId":1000,
// "status":1,

// "accuickJobId":"205834",
// "jobTitle":"5VoFO8t7jrwrPGrYYEZpIyjfl48JrWhhNbStPwifS7M=",
// "clientName":"M/3dfaEC+ejkwQ1F+DPf/w==",
// "city":"4JjXI2inUIsAKTFjFzGiRQ==",
// "state":"UzN0co9PGTog87jtQO1ANw==",
// "zipcode":"SIO0D+WBSdchLBWycI8lSw==",
// "payRate":"5xF19NPDGA1CS47gYqdRnw==",
// "jobType":"icUeqVUlKpRbq2X/WC8lhHtKLQC+RL+5MKVaitCHqvk=",
// "description":"

        this.showSpinner = true;
        let fileobj: any = {
          'filename': name,
          'extension': ext,
          'size': file.size
        }
        this.staticAuditLogAPI('99', JSON.stringify(fileobj));

        this.userService.applyasguestresumeupload(formData).subscribe((response) => {
          console.log(response);
          this.showSpinner = false;
          if (response.Success) {
            localStorage.removeItem('source');
            // this.toastr.success(response.Message);
            if(response && response.Status){
              if(response.jobAlreadyApplied){
                this.router.navigate(['/already-applied']);
              } else {
                localStorage.setItem('firstName', response.firstName);
                localStorage.setItem('lastName', response.lastName);
                localStorage.setItem('email', response.email);
                this.router.navigate(['/thanks-for-applying']);
              }
            } 
            // this.getreviewdetails(); 


          } else {
            
            //this.toastr.error(response.Message);
            if(response.basicInfo){
              if(response.email.trim() == ''){
                this.emailEmpty = true;
              }
              if(response.firstName.trim() == ''){
                this.firstNameEmpty = true;
              }
              if(response.lastName.trim() == ''){
                this.lastNameEmpty = true;
              }
                const dialogRef = this.dialog.open(BasicInfoNotFoundComponent, {
                  width: "100%",
                  maxWidth: "100%",
                  height: "100%",
                  maxHeight: "100%",
                  data: { resume: this.file[0], emailEmpty:this.emailEmpty, firstNameEmpty:this.firstNameEmpty, lastNameEmpty:this.lastNameEmpty , firstName:response.firstName.trim(), lastName: response.lastName.trim(), email: response.email.trim()}
                  // hasBackdrop: false,
                });

              dialogRef.afterClosed().subscribe((result: { status: Boolean; }) => {
                if (result) {
                  // this.jobsList[i].applied = result.status;
                }
                console.log(result);
              });
            }

          }

        }, (error => {

        }));
        //}
  }

  loginApplyJob() {
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
        // if(this.isAlreadyOldUser){
        //       localStorage.setItem('isAlreadyOldUser', 'true');
        //     }   
        //     this.router.navigate(['/thanks-for-applying']);


        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response.Error){
            this.toastr.error(response.Message);
          }else{
            if (response && response.Status) {
              /****already applied job */
              if(response && response.Status && response.jobAlreadyApplied){
                //this.toastr.success(response.Message);
                this.router.navigate(['/already-applied']);
                return;
              } 

              if(this.isAlreadyOldUser){
                localStorage.setItem('isAlreadyOldUser', 'true');
              }   
              this.router.navigate(['/thanks-for-applying']);
          }
         console.log(response);
        }

      }, (error => {

      }));
  }


  createLoginForm():void {

    this.submitted = true;
    this.showSpinner = true;
    if(!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value);
    let todo = {
      "email" : this.auditlogService.encryptAES(this.loginForm['controls'].email.value), 
      "password":this.auditlogService.encryptAES(this.loginForm.value.password),
      "sourceLookupId" : 10002002,
      "keepInSign":(this.loginForm.value.check) ? 1 : 0
      //"communityId" : 1000,
       //"status" : 1   
    }


      this.userService.login(todo).subscribe((response)=>{
        // this.listTodos();
        console.log(response);
        this.showSpinner = false;

        // console.log(response.headers.get('inc-auth-token'));
        if(response && response.body && response.body.Error){        
          this.toastr.error(response.body.Message);
        }
        if(response && response.body && response.body.Success){
          
        
          this.userService.setToken(response.headers.get('csn-auth-token'));
          this.userService.setUserId(response.body.userId);
          this.userService.setUserType(response.body.userType);   
          localStorage.setItem("isUploadResumeStatus",response.body.isUploadResumeStatus);
          localStorage.setItem("completedAssessments",response.body.completedAssessments);
          localStorage.setItem("totalAssessments",response.body.totalAssessments);
          this.countChange.updateCount(response.body.completedAssessments);
          this.countChange.updateTotal(response.body.totalAssessments);

          localStorage.setItem('firstName', response.body.firstName);
          localStorage.setItem('lastName', response.body.lastName);
          localStorage.setItem('email', response.body.email);

          // if(localStorage.getItem("pageFrom") == 'accuick' && localStorage.getItem('jobData')){
            // this.router.navigate(['/thanks-for-applying']);
            this.loginApplyJob();
            return;
          // } 
          // else if(localStorage.getItem("pageFrom") == 'assessments'){
          //   this.router.navigate(['/assessments']);
          //   return;
          // }
          if(response.body.isUploadResumeStatus == 0){
            if(this.redirectTo) {
              this.router.navigate(['/upload-resume']);
            }else{
              this.router.navigate(['/upload-resume']);
            }
          } else if (response.body.isUploadResumeStatus == 1){  
            if(this.redirectTo) {
              this.router.navigate(['/create-upload-resume']);
             }else{
              this.router.navigate(['/create-upload-resume']);
            }
          } else {
            if(this.redirectTo) {
              this.router.navigate(['/profile']);
            }else{
              if(localStorage.getItem('mailJobId')){
                this.router.navigate(['/jobs']);
              } else {
                if(localStorage.getItem('emailFromProfile')){
                  localStorage.removeItem('emailFromMail');
                  localStorage.removeItem('emailFromProfile');
                  this.router.navigate(['/profile']);
                } else {
                  this.router.navigate(['/dashboard']);
                }
              }
            }

          }

        }
        // this.router.navigate(['items'], { relativeTo: this.route });
      },(error=>{

      }));


  

  }

  clickJobsEvent() {
    this.staticAuditLogAPI('102', '');
    this.jobsTab = this.jobsTab;
  }

  getJobsApplied(type: any) {
    this.searched = false;
    this.showSpinner = true;
    this.userService.getJobsApplied().
      subscribe((response: any) => {
        this.showSpinner = false;
        this.searched = true;
        if (response && response.Status == 401) {
          this.toastr.error(response.message);
        }
        if (response && response.Success) {
          // response = JSON.parse(response);

          console.log('Jobs Applied');
          if (type) {
            this.staticAuditLogAPI('108', '');
          }
          console.log(response);
          if (response.Jobs.length) {
            response.Jobs.forEach((jobApp: any) => {
              jobApp.appliedDate = this.userService.getDateFormat(jobApp.appliedDate);
              this.jobsList.forEach(el => {
                if (jobApp.accuickJobId == Number(el.jobid)) {
                  el.applied = true;
                }
              });
              jobApp.city = (jobApp.city) ? this.auditlogService.decryptAES(jobApp.city) : '';
              jobApp.clientName = (jobApp.clientName) ? this.auditlogService.decryptAES(jobApp.clientName) : '';
              jobApp.jobTitle = (jobApp.jobTitle) ? this.auditlogService.decryptAES(jobApp.jobTitle) : '';
              jobApp.state = (jobApp.state) ? this.auditlogService.decryptAES(jobApp.state) : '';
              jobApp.zipcode = (jobApp.zipcode) ? this.auditlogService.decryptAES(jobApp.zipcode) : '';
              jobApp.payRate = (jobApp.payRate) ? this.auditlogService.decryptAES(jobApp.payRate) : '';
              jobApp.jobType = (jobApp.jobType) ? this.auditlogService.decryptAES(jobApp.jobType) : '';
              jobApp.description = (jobApp.description) ? this.auditlogService.decryptAES(jobApp.description) : '';
            });
          }
          this.jobsAppliedList = response.Jobs;

        }

      }, (error => {

      }));
  }
  getcareerjobdetails(){
    let id = this.jobIdToLoad;
    let datatopass = {
      "jobName":this.jobIdToLoad
    }
  
    this.userService.getcareerjobdetails(datatopass).subscribe((response: any) => {
      this.showSpinner = false;
      console.log(response);
      if (response && response.Status == 401) {
        this.toastr.error(response.message);
      }
      if (response && response.length) {
        // response = JSON.parse(response);

            localStorage.setItem("pageFrom", 'accuick');
            localStorage.setItem("jobData", JSON.stringify(response[0]));
          response.forEach((el: any) => {
            el.date = this.userService.getDateFormat(el.date);
            el.applied = false;
            el.description = this.rj.removeJunk(el.description);
            el.descShort = this.rj.removeJunk(el.description.replace(/\r\n/g, ' ').replace(/<br \/>/g, ' '));
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
            this.selectedJob = response[0];

            if (this.userService.isUserLoggedIn()) {
              this.loginApplyJob();
            } 
          

      }

    }, (error => {

    }));
  }
  getRecommendJobs() {
    this.searched = false;
    this.showSpinner = true;
    let jobId = localStorage.getItem('mailJobId') ? localStorage.getItem('mailJobId') : 0;
    this.userService.getAccuickJob().subscribe((response: any) => {
      this.showSpinner = false;
      if (response && response.Status == 401) {
        this.toastr.error(response.message);
      }
      if (response && response.length) {
        // response = JSON.parse(response);

        console.log(response);
        // debugger
        if (response.length) {
          const tobeSelJob = this.jobIdToLoad;
          response.forEach(function (item: any, i: number) {
            if (item.jobid == tobeSelJob) {
              response.splice(i, 1);
              response.unshift(item);
            }
          });
          if (localStorage.getItem('mailJobId')) {
            let locVal: string | any = localStorage.getItem('mailJobId');
            let flexTempObj = response.filter(function (obj: any) {
              return obj.jobid == locVal;
            });
            if (flexTempObj && flexTempObj.length) {
              this.selectedJob = flexTempObj[0];
            } else {
              this.selectedJob = response[0];
            }
            localStorage.removeItem('mailJobId');
          } else {
            this.selectedJob = response[0];
          }
          // this.candData.flexibilityPref = (flexTempObj.length) ? flexTempObj[0].lookupValue : '';

          // let index = response.findIndex(x => x.jobid === "Skeet");
          // console.log(flexTempObj);
          // this.assessmentsAry
          this.assessmentsAry = (this.selectedJob.assessment && this.selectedJob.assessment.length) ? this.selectedJob.assessment.split(",") : [];
          // console.log(assessmentsAry);
          // if((assessRequiredAry && assessRequiredAry.length)){
          //     assessRequiredAry.forEach((el: any) => {
          //       console.log(el);
          //     });

          // }

          response.forEach((el: any) => {
            el.date = this.userService.getDateFormat(el.date);
            el.applied = false;
            el.description = this.rj.removeJunk(el.description);
            el.descShort = this.rj.removeJunk(el.description.replace(/\r\n/g, ' ').replace(/<br \/>/g, ' '));
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
          this.selectedIndex = 0;
        }
        this.jobsList = response;
        this.searched = true;

        // if (this.isMobile) {
        //   const dialogRef = this.dialog.open(ShowApplyJobComponent, {
        //     maxWidth: "800px",
        //     data: { selectedJob: this.selectedJob,pageName:'apply-jobs' },
        //     // hasBackdrop: false,
        //   });

        //   dialogRef.afterClosed().subscribe((result: { status: Boolean; }) => {
        //     if (result) {
        //       // this.jobsList[i].applied = result.status;
        //     }
        //     console.log(result);
        //   });
        // }
        // this.getJobsApplied(false);
      }

    }, (error => {

    }));
  }

  getcategorylist() {
    // console.log(this.loginForm.value);
    this.userService.getcategorylist().subscribe((response: any) => {
      if (response && response.Success) {
        this.userService.categoryList = response.CategoryList;
        this.loadObjects();
      }
    }, (error => {

    }));
  }

  loadObjects() {
    let curEmpStatusobj = this.userService.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10010;
    });
    this.jobtypes = (curEmpStatusobj && curEmpStatusobj.length) ? curEmpStatusobj[0].lookupsList : [];
  }
  selectJob(i: number) {
    this.selectedJob = this.jobsList[i];
    this.selectedIndex = i;
    // if (this.isMobile) {
    //   const dialogRef = this.dialog.open(ShowJobComponent, {
    //     maxWidth: "800px",
    //     data: { selectedJob: this.selectedJob,pageName:'find-jobs' },
    //     // hasBackdrop: false,
    //   });

    //   dialogRef.afterClosed().subscribe((result: { status: Boolean; }) => {
    //     if (result) {
    //       this.jobsList[i].applied = result.status;
    //     }
    //     console.log(result);
    //   });
    // }
  }
  applyJob() {
    localStorage.setItem("pageFrom", 'accuick');
    localStorage.setItem("jobData", JSON.stringify(this.selectedJob));
    if (!this.userService.isUserLoggedIn()) {
      this.router.navigate(['/login']);
      Emitters.authEmitter.emit(false);
    } else {
      Emitters.authEmitter.emit(true);
      this.router.navigate(['/thanks-for-applying']);
      // this.router.navigate(['/thankyou-for-apply']);

    }
    this.router.navigate(['/login']);
    return;
    let payrate = "";
    if (this.selectedJob.payrate) {
      payrate = this.selectedJob.payrate;
    } else {
      payrate = this.selectedJob.payrange;
      // if (this.selectedJob.payrange1) {
      //   payrate = this.selectedJob.payrange1
      // }
      // if (this.selectedJob.payrange2) {
      //   payrate += this.selectedJob.payrange2
      // }
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
      source: 'cxninja'
    }
    this.showSpinner = true;
    this.userService.applyJob(dataToPass).
      subscribe((response: any) => {
        this.showSpinner = false;
        if (response && response.Status == 401) {
          this.toastr.error(response.message);
        }
        if (response && response.Status) {
          if (response.Error) {
            this.toastr.error(response.Message);
          } else {
            this.jobsList[this.selectedIndex].applied = true;
            this.selectedJob.applied = true;
            if (response.Message.includes('already')) {
              this.toastr.info(response.Message);
            } else {
              this.toastr.success(response.Message);
            }
          }
          console.log(response);
        }

      }, (error => {

      }));
  }

  ngOnInit(): void {

    if (!this.userService.isUserLoggedIn()) {

      this.isAlreadyOldUser = true;
    }

    // this.actRoute.params.subscribe(params => {
    //   console.log(params);
    //   if (params.id) {
    //     this.jobIdToLoad = params.id;
    //   }
    // });
      // alert(document.referrer);

          this.loginForm  = this.formBuild.group({
            email : new FormControl(this.emailId, [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]),
            password:new FormControl('', [Validators.required]),
            check: new FormControl(true)
          });

    this.actRoute.queryParams
      .subscribe(params => {
        // this.emailid = params.emailid ? params.emailid : '';
        console.log(params);
        this.jobIdFromMail = params.email ? params.email : '';
        this.jobIdToLoad = params.jobid ? params.jobid : '';

          let urlSsource = document.referrer;
          // if(urlSsource.indexOf('cxninja') != -1) urlSsource="cxninja";
          // else
          // if(urlSsource.indexOf('monster') != -1) urlSsource="Monster";
          // else
          // if(urlSsource.indexOf('google') != -1) urlSsource="Google";
          // else
          // if(urlSsource.indexOf('indeed') != -1) urlSsource="Indeed";
          // else
          // if(urlSsource.indexOf('linkedin') != -1) urlSsource ="linkedin";
          // else urlSsource="cxninja";
          let source = urlSsource; //params.source ? params.source : 'accuick';
          console.log(source);
          localStorage.setItem('source', source);
          
      });

    

    // this.getRecommendJobs();
    this.getcareerjobdetails();
    this.isMobile = (window.innerWidth < 720) ? true : false;

   
  }

  getAssessmentName(assessmentname: any) {
    let obj = this.selectedJob.requiredAssessments.find((assessments: any) => {
      if (assessments.assessmentsId === (assessmentname.trim()))
        return true;
      else
        return false;
    });
    return obj;

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
