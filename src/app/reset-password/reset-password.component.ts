import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { CustomValidators } from 'custom-validators';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from '../shared/auditlog.service';
import { RemoveJunkTextService } from '../shared/services/remove-junk-text.service';
import { UserAuthService } from '../user-auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  hide = true;
  passwordhide = true;
  color = 'accent';
  resetEmailParam: any;
  disabledName = false;
  token: any;
  jobId: any;
  showSpinner = false;
  emailId: any;
  selectedJob: any;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    public rj: RemoveJunkTextService,
    private router: Router
  ) {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const myParamValue = params.get('token');
      if (myParamValue) {
        this.emailId = myParamValue.split(':')[0];
      }
      if (params.get('jobId')) {
        this.jobId = params.get('jobId');
      }
    });

    this.resetForm = formBuilder.group(
      {
        email: new FormControl({ value: this.emailId, disabled: true }, [
          Validators.required,
          Validators.email,
        ]),
        // email: ['', Validators.required,Validators.email],
        password: new FormControl('', [
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validator: this.ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      //******************* - -  ********************/
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
      {
        return;
      }
    };
  }

  getjobdetails() {
    let id = this.jobId;
    this.userService.getjobdetails(id).subscribe(
      (response: any) => {
        if (response && response.length) {
          // response = JSON.parse(response);
          response.forEach((el: any) => {
            el.date = this.userService.getDateFormat(el.date);
            el.applied = false;
            el.description = this.rj.removeJunk(el.description);
            el.descShort = this.rj.removeJunk(
              el.description.replace(/\r\n/g, ' ').replace(/<br \/>/g, ' ')
            );            
              el.payrange1 = el.payrange;
            // if (el.payrange.includes('-')) {
            //   if (el.payrange.split('-')[0]) {
            //     el.payrange1 = parseFloat(el.payrange.split('-')[0]).toFixed(2);
            //     el.payrange1 = el.payrange1 != '0.00' ? el.payrange1 : '';
            //   }
            //   if (el.payrange.split('-')[1]) {
            //     el.payrange2 = parseFloat(el.payrange.split('-')[1]).toFixed(2);
            //     el.payrange2 = el.payrange2 != '0.00' ? el.payrange2 : '';
            //   }
            //   el.payrange = '';
            // }
          });
          localStorage.setItem('jobData', JSON.stringify(response[0]));
          this.selectedJob = response[0];
        }
      },
      (error) => {}
    );
  }

  applyJob() {
    let payrate = '';
    if (this.selectedJob.payrate) {
      payrate = this.selectedJob.payrate;
    } else {
      payrate = this.selectedJob.payrange;
      // if (this.selectedJob.payrange1) {
      //   payrate = this.selectedJob.payrange1;
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
    // this.showSpinner = true;

    this.userService.applyJob(dataToPass).subscribe(
      (response: any) => {
        this.showSpinner = false;

        // if(this.isAlreadyOldUser){
        //       localStorage.setItem('isAlreadyOldUser', 'true');
        //     }
        //     this.router.navigate(['/thanks-for-applying']);

        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Status) {
          if (response.Error) {
            this.toastr.error(response.Message);
          } else {
            // if(this.isAlreadyOldUser){
            localStorage.setItem('isAlreadyOldUser', 'true');
            // }
            this.router.navigate(['/thanks-for-applying']);
          }
          console.log(response);
        }
      },
      (error) => {}
    );
  }

  createResetForm(): void {
    this.submitted = true;

    if (!this.resetForm.valid) {
      return;
    }
    //console.log(this.resetForm.value);
    let todo = {
      email: this.auditlogService.encryptAES(
        this.resetForm['controls'].email.value
      ),
      password: this.auditlogService.encryptAES(this.resetForm.value.password),
    };
    this.showSpinner = true;
    this.userService.getResetPassword(todo).subscribe(
      (response) => {
        console.log(response);
        if (response && response.body && response.body.Error) {
          this.toastr.error(response.body.Message);
        }
        if (response && response.body && response.body.Success) {
          this.toastr.success(response.body.Message);
          // this.resetForm.value.email = null;
          this.resetForm.value.password = null;
          this.resetForm.value.confirmPassword = null;
          this.userService.setToken(response.headers.get('csn-auth-token'));
          this.userService.setUserType(response.body.userType);
          this.userService.setUserId(response.body.userId);
          if (this.jobId) {
            localStorage.setItem('firstName', response.body.firstName);
            localStorage.setItem('lastName', response.body.lastName);
            localStorage.setItem('email', response.body.email);
            this.userService.setUserType(response.body.userType);
            this.applyJob();
          } else {
            this.showSpinner = false;
            if (response.body.isUploadResumeStatus == 0) {
              this.router.navigate(['/upload-resume']);
            } else if (response.body.isUploadResumeStatus == 1) {
              this.router.navigate(['/create-upload-resume']);
            } else {
              this.router.navigate(['/find-jobs']);
            }
          }
        }
      },
      (error) => {}
    );
  }

  ngOnInit(): void {
    if (this.userService.isUserLoggedIn()) {
      this.router.navigate(['/upload-resume']);
    }
    if (this.jobId) {
      this.getjobdetails();
    }
  }
}
