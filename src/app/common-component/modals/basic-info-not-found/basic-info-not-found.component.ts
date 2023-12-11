import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UserAuthService } from 'src/app/user-auth.service';

@Component({
  selector: 'app-basic-info-not-found',
  templateUrl: './basic-info-not-found.component.html',
  styleUrls: ['./basic-info-not-found.component.css']
})
export class BasicInfoNotFoundComponent implements OnInit {

  basicInfoForm: FormGroup;
  // basicInfoForm: any;
  value:string= '';
  emailId= '';
  firstName= '';
  lastName= '';
  selectedJob:any

  emailEmpty=false;
  firstNameEmpty=false;
  lastNameEmpty=false;

  showSpinner = false;
  resume:any;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<BasicInfoNotFoundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private auditlogService: AuditlogService,
    private router: Router,
    private userService: UserAuthService
    ) { 

    this.basicInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]]

    });
    // this.basicInfoForm.addControl('firstName', new FormControl('', Validators.required));
  }

  
  submitForm(event: any) {
        console.log(event);
    
        

        console.log(this.selectedJob);
        // return;


        this.showSpinner = true;


        let formData = new FormData();
        let payrate = "";
        if(this.selectedJob.payrate){
          payrate = this.selectedJob.payrate;
        } else{
          if(this.selectedJob.payrange1){
            payrate = this.selectedJob.payrange1 + ' - '
          }
          if(this.selectedJob.payrange2){
            payrate += this.selectedJob.payrange2
          }
        }

        // formData.append("userId", userId);
        formData.append("firstName", this.data.firstName ? this.auditlogService.encryptAES(this.data.firstName) : this.auditlogService.encryptAES(this.basicInfoForm.value.firstName)); 
        formData.append("lastName", this.data.lastName ? this.auditlogService.encryptAES(this.data.lastName) : this.auditlogService.encryptAES(this.basicInfoForm.value.lastName)); 
        formData.append("email", this.data.email ? this.auditlogService.encryptAES(this.data.email) : this.auditlogService.encryptAES(this.basicInfoForm.value.email)); 
        formData.append("resume", this.resume);
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


        this.showSpinner = true;


        this.userService.applyasguestresumeupload(formData).subscribe((response) => {
          console.log(response);
          this.showSpinner = false;
          if (response.Success) {
          localStorage.removeItem('source');
            // this.toastr.success(response.Message);
            this.dialogRef.close();

            // localStorage.setItem('email',this.basicInfoForm.value.email);
          localStorage.setItem('firstName', response.firstName);
          localStorage.setItem('lastName', response.lastName);
          localStorage.setItem('email', response.email);

            this.router.navigate(['/thanks-for-applying']);



            // this.getreviewdetails();


          } else {
            this.toastr.error(response.Message);

          }

        }, (error => {

        }));
        //}
  }

  ngOnInit(): void {
    this.selectedJob = JSON.parse(localStorage.getItem("jobData") || "");
    console.log(this.data);
    this.resume = this.data.resume;
    this.emailEmpty = this.data.emailEmpty;
    this.firstNameEmpty = this.data.firstNameEmpty;
    this.lastNameEmpty = this.data.lastNameEmpty;
    if(!this.emailEmpty){
      this.basicInfoForm.removeControl('email');
    }
    if(!this.firstNameEmpty){
      this.basicInfoForm.removeControl('firstName');
    }
    if(!this.lastNameEmpty){
      this.basicInfoForm.removeControl('lastName');
    }
  }

}
