import { Component, OnInit, Output, EventEmitter, Input, ElementRef, Renderer2 } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuditlogService } from '../shared/auditlog.service';
import { RemoveJunkTextService } from '../shared/services/remove-junk-text.service';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from '../class/emitters/emitters';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CustomValidators } from 'custom-validators';
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
  selector: 'app-thanks-for-applying',
  templateUrl: './thanks-for-applying.component.html',
  styleUrls: ['./thanks-for-applying.component.css'],
})
export class ThanksForApplyingComponent implements OnInit {
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
  isAlreadyOldUser = localStorage.getItem('isAlreadyOldUser' || '{}');
  selectedJob: any; // = JSON.parse(localStorage.getItem("jobData") || '{}');
  @Input() isAssessmentList: any;
  @Output() shareAssessmentObjRec = new EventEmitter<any>();
  assessmentObjRec: any;
  jobsDataLoad = false;
  isMobile = false;
  userGetType: any;

  itemsPerSlide = 2;
  noWrapSlides = false;
  showIndicator = false;
  myInterval = 5000000;
  userIdToPass = localStorage.getItem('userId');

  jobsList: Job[] = [];

  auditObj = {
    actionId: '',
    userId: '',
    jsonData: '',
  };

  loginForm: any;
  submitted = false;
  hide = true;
  showBottomViewAll = false;

  constructor(
    private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    public rj: RemoveJunkTextService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private render: Renderer2,
    private countChange: AssessmentCountService
  ) {
    this.frontEndURL = environment.FrontEndURLForUser;
    this.badgesPath = environment.badgesPath;
  }

  getJobNumber() {
    return Math.floor(Math.random() * (999 - 100 + 1) + 100);
  }

  applyJob() {
    let payrate = '';
    if (this.selectedJob.payrate) {
      payrate = this.selectedJob.payrate;
    } else {
      payrate = this.selectedJob.payrange;
      // if (this.selectedJob.payrange1) {
      //   payrate = this.selectedJob.payrange1 + ' - ';
      // }
      // if (this.selectedJob.payrange2) {
      //   payrate += this.selectedJob.payrange2;
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
      description: this.auditlogService.encryptAES(
        this.selectedJob.description
      ),
      source:
        localStorage.getItem('source') || '{}'
          ? localStorage.getItem('source') || '{}'
          : 'cxninja',
    };
    this.showSpinner = true;

    this.userService.applyJob(dataToPass).subscribe(
      (response: any) => {
        localStorage.removeItem('source');
        this.showSpinner = false;
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
      },
      (error) => {}
    );
  }

  getJobsApplied(type: any) {
    this.showSpinner = true;
    this.userService.getJobsApplied().subscribe(
      (response: any) => {
        this.showSpinner = false;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
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
              jobApp.appliedDate = this.userService.getDateFormat(
                jobApp.appliedDate
              );
              this.jobsList.forEach((el) => {
                if (jobApp.accuickJobId == Number(el.jobid)) {
                  el.applied = true;
                }
              });
              jobApp.city = jobApp.city
                ? this.auditlogService.decryptAES(jobApp.city)
                : '';
              jobApp.clientName = jobApp.clientName
                ? this.auditlogService.decryptAES(jobApp.clientName)
                : '';
              jobApp.jobTitle = jobApp.jobTitle
                ? this.auditlogService.decryptAES(jobApp.jobTitle)
                : '';
              jobApp.state = jobApp.state
                ? this.auditlogService.decryptAES(jobApp.state)
                : '';
              jobApp.zipcode = jobApp.zipcode
                ? this.auditlogService.decryptAES(jobApp.zipcode)
                : '';
              jobApp.payRate = jobApp.payRate
                ? this.auditlogService.decryptAES(jobApp.payRate)
                : '';
              jobApp.jobType = jobApp.jobType
                ? this.auditlogService.decryptAES(jobApp.jobType)
                : '';
              jobApp.description = jobApp.description
                ? this.auditlogService.decryptAES(jobApp.description)
                : '';
            });
          }
        }
      },
      (error) => {}
    );
  }

  getAccuickJob() {
    // let jobId =  0;
    let jobId = this.selectedJob.jobid; //localStorage.getItem('mailJobId') ? localStorage.getItem('mailJobId') : 0;

    this.userService.getAccuickJob().subscribe(
      (response: any) => {
        this.jobsDataLoad = true;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.length) {
          // response = JSON.parse(response);

          console.log(response);
          if (response.length) {
            response.forEach((el: any) => {
              el.applied = false;
              el.description = this.rj.removeJunk(el.description);
              el.descShort = this.rj.removeJunk(
                el.description.replace(/\r\n/g, ' ').replace(/<br \/>/g, ' ')
              );
              el.date = this.userService.getDateFormat(el.date);
              el.payrange1 = el.payrange;
              if (el.payrange.includes('-')) {
                if (el.payrange.split('-')[0]) {
                  el.payrange1 = parseFloat(el.payrange.split('-')[0]).toFixed(
                    2
                  );
                  el.payrange1 = el.payrange1 != '0.00' ? el.payrange1 : '';
                }
                if (el.payrange.split('-')[1]) {
                  el.payrange2 = parseFloat(el.payrange.split('-')[1]).toFixed(
                    2
                  );
                  el.payrange2 = el.payrange2 != '0.00' ? el.payrange2 : '';
                }
                el.payrange = '';
              }
            });
          }
          this.jobsList = response;
           if(localStorage.getItem('userId') && localStorage.getItem('userId') != 'undefined'){
            this.getJobsApplied(false);

           }
        }
      },
      (error) => {}
    );
  }

  ngOnInit(): void {
      Emitters.authEmitter.emit(true);
      // this.orderId = this.randomString(10);
    this.firstName =
      localStorage.getItem('firstName') || '{}'
        ? this.auditlogService.decryptAES(
            localStorage.getItem('firstName') || '{}'
          )
        : '';
    this.lastName =
      localStorage.getItem('lastName') || '{}'
        ? this.auditlogService.decryptAES(
            localStorage.getItem('lastName') || '{}'
          )
        : '';
    this.email =
      localStorage.getItem('email') || '{}'
        ? this.auditlogService.decryptAES(localStorage.getItem('email') || '{}')
        : '';

    this.userGetType = this.userService.getUserType();
    console.log(this.userGetType);
    //this.userGetType= this.userService.getToken();

    //this.getAssessments();

    localStorage.removeItem('pageFrom');
    this.selectedJob = JSON.parse(localStorage.getItem('jobData') || '{}');

    // this.selectedJob.forEach((el: any) => {
    this.selectedJob.date = this.userService.getDateFormat(
      this.selectedJob.date
    );
    this.selectedJob.applied = false;
    this.selectedJob.description = this.selectedJob.description
      ? this.rj.removeJunk(this.selectedJob.description)
      : '';
    this.selectedJob.descShort = this.selectedJob.description
      ? this.rj.removeJunk(
          this.selectedJob.description
            .replace(/\r\n/g, ' ')
            .replace(/<br \/>/g, ' ')
        )
      : '';
    if (this.selectedJob.payrange && this.selectedJob.payrange.includes('-')) {
      if (this.selectedJob.payrange.split('-')[0]) {
        this.selectedJob.payrange1 = parseFloat(
          this.selectedJob.payrange.split('-')[0]
        ).toFixed(2);
        this.selectedJob.payrange1 =
          this.selectedJob.payrange1 != '0.00'
            ? this.selectedJob.payrange1
            : '';
      }
      if (
        this.selectedJob.payrange &&
        this.selectedJob.payrange.split('-')[1]
      ) {
        this.selectedJob.payrange2 = parseFloat(
          this.selectedJob.payrange.split('-')[1]
        ).toFixed(2);
        this.selectedJob.payrange2 =
          this.selectedJob.payrange2 != '0.00'
            ? this.selectedJob.payrange2
            : '';
      }
      this.selectedJob.payrange = '';
    }
    // });

    // this.getAccuickJob();
    this.isMobile = window.innerWidth < 990 ? true : false;

    this.loginForm = this.formBuilder.group({
      email: new FormControl({ value: this.email, disabled: true }, [
        Validators.required,
        Validators.pattern(
          /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        Validators.minLength(8),
      ]),
      check: new FormControl(false),
    });

    if(this.isMobile){

      this.render.listen('window', 'scroll', () => {
        // const rect = this.el.nativeElement.getBoundingClientRect().top;
        var isMobileHeight = this.el.nativeElement.querySelector("#viewall").getBoundingClientRect().top;
        // console.log('higth==' + isMobileHeight);
        this.showBottomViewAll = isMobileHeight < 50 ? true : false;

        // console.log(this.isMobileHeight);
      });
    }

  }

  randomString(length: any) {
    var randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }

  openInviteForm(obj: any): void {
    console.log(obj);
    this.orderId = obj.orderId ? obj.orderId : this.randomString(10);
    localStorage.setItem('orderId', this.orderId);
    localStorage.setItem('assessmentsId', obj.assessmentsId);
    localStorage.setItem('assessData', JSON.stringify(obj));
    this.assessmentsId = obj.assessmentsId;
    // return;
    if (obj.assessmentsId == 'JB-ACCUICKEVP') {
      // obj.completionStatus == '10018001' ||
      if (obj.assessmentsId == 'JB-ACCUICKEVP') {
        this.pdfId = 'www4.accuick.com';
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
          packageId: { value: obj.assessmentsId },
          orderId: { value: this.orderId },
          candidate: {
            first: this.firstName,
            last: this.lastName,
            email: this.email,
          },
          returnURL: {
            uri: this.frontEndURL + 'redirectassessment',
          },
          // "sendCandidateEmail": true
        };

        //START
        if (obj.count == '0') {
          this.staticAuditLogAPI('142', JSON.stringify(this.dataToPass));
        }
        //RETAKE
        if (obj.count == 1) {
          this.staticAuditLogAPI('144', JSON.stringify(this.dataToPass));
        }

        this.showSpinner = true;
        this.userService.orderHireSelect(this.dataToPass).subscribe(
          (response) => {
            console.log(response);
            this.showSpinner = false;
            if (response && response.assessmentAccessURL) {
              let ary = response.assessmentAccessURL.uri.split('/');
              this.pdfId = ary[ary.length - 1];
              this.saveAssessmentDatabase();

              // this.dialogRef.close((ary[ary.length -1]));
            }
          },
          (error) => {}
        );
      }
    }
  }
  saveAssessmentDatabase() {
    let dataToPass = {
      userId: localStorage.getItem('userId'),
      assessmentsId: this.assessmentsId,
      orderId: this.orderId,
      assessmentURL: this.pdfId,
    };

    this.showSpinner = true;
    this.userService.saveAssessmentDatabase(dataToPass).subscribe(
      (response: any) => {
        this.showSpinner = false;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Status == 200) {
          this.goToAssessment();
        }
      },
      (error) => {}
    );
  }

  goToAssessment() {
    this.router.navigate(['/assessment'], {
      queryParams: { id: this.pdfId, oId: this.orderId },
    });
  }

  getMoreInformation(): string {
    return 'Retake assessment is your last chance to improve your overall performance score and to get golden badge.\n A Candidate with maximum number of golden badges have higher chances of getting shortlisted by top employers.';
  }

  getAssessments() {
    this.showSpinner = true;
    this.userService.getreviewdetails().subscribe(
      (response: any) => {
        this.showSpinner = false;

        if (response && response.Success) {
          // this.assessmentsList = response.assessmentsList;
          // this.assessments = response.assessmentsList;
          for (let i = 0; i < response.assessmentsList.length; i++) {
            if (response.assessmentsList[i].count < 1) {
              this.assessments.push(response.assessmentsList[i]);
            }
          }

          if (!this.assessments.length) {
            this.staticAuditLogAPI('153', '');
            this.getAccuickJob();
          } else {
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
      },
      (error) => {}
    );
  }

  backtoresults(){
    localStorage.setItem("showPrevRecord","true");
    if(this.userService.getUserType() == 'true'){    
      this.router.navigate(['/jobs']);
    } else {    
      this.router.navigate(['/find-jobs']);
    }
  }

  goToSeeAllJobs() {
    if (this.userService.getToken() && this.userGetType == 'true') {
      //this.staticAuditLogAPI('154', '');
      this.router.navigate(['/jobs']);
    } else {
      this.router.navigate(['/find-jobs']);
    }
  }

  goToJobList(id: any) {
    if (this.userService.getToken() && this.userGetType == 'true') {
      //this.staticAuditLogAPI('154', '');
      this.router.navigate(['/jobs'], { queryParams: { jobId: id } });
    } else {
      //this.router.navigate(['/find-jobs'])
      this.router.navigate(['/find-jobs'], { queryParams: { jobid: id } });
    }
  }

  staticAuditLogAPI(actionId: string, jsonString: string) {
    let num: any = localStorage.getItem('userId'); //number
    //let stringForm = num.toString();
    this.auditObj.actionId = actionId;
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
      (error) => {}
    );
  }

  createLoginForm(): void {
    this.submitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value);

    let todo = {
      email: this.auditlogService.encryptAES(
        this.loginForm['controls'].email.value
      ),
      password: this.auditlogService.encryptAES(this.loginForm.value.password),
      status: 1,
    };
    this.userService.guestSignup(todo).subscribe(
      (response) => {
        console.log(response);
        if (response && response.body && response.body.Error) {
          this.toastr.error(response.body.Message);
        }
        if (response && response.body && response.body.Success) {
          this.userService.setToken(response.headers.get('csn-auth-token'));
          this.userService.setUserId(response.body.userId);
          this.userService.setUserType(response.body.userType);
          localStorage.setItem(
            'isUploadResumeStatus',
            response.body.isUploadResumeStatus
          );
          localStorage.setItem(
            'completedAssessments',
            response.body.completedAssessments
          );
          localStorage.setItem(
            'totalAssessments',
            response.body.totalAssessments
          );
          this.countChange.updateCount(response.body.completedAssessments);
          this.countChange.updateTotal(response.body.totalAssessments);

          localStorage.setItem('firstName', response.body.firstName);
          localStorage.setItem('lastName', response.body.lastName);
          localStorage.setItem('email', response.body.email);

          localStorage.setItem('isUploadResumeStatus', '1');

          /* =================== */
          // localStorage.setItem("isUploadResumeStatus",response.body.isUploadResumeStatus);
          //   localStorage.setItem("completedAssessments",response.body.completedAssessments);
          //   localStorage.setItem("totalAssessments",response.body.totalAssessments);
          // localStorage.setItem("isUploadResumeStatus","1");
          /*******************new ************/
          // this.userService.setToken(response.headers.get('csn-auth-token'));
          // this.userService.setUserId(response.body.userId);
          // this.userService.setUserType(response.body.userType);
          //**************************************************** */

          // this.countChange.updateCount(response.body.completedAssessments);
          // this.countChange.updateTotal(response.body.totalAssessments);
          // this.router.navigate(['/thanks-for-joining']);
          this.toastr.success('Your account created Successfully.');

          if (this.userService.getToken()) {
            //this.staticAuditLogAPI('154', '');
            this.router.navigate(['/jobs']);
          } else {
            this.router.navigate(['/find-jobs']);
          }
        }
      },
      (error) => {}
    );
  }
}
