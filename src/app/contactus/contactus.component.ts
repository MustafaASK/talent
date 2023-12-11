import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { startWith, pairwise } from 'rxjs/operators';
import { AuditlogService } from '../shared/auditlog.service';
import { UserAuthService } from '../user-auth.service';
import { ActivatedRoute, Router,ParamMap } from '@angular/router';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  contactusForm: FormGroup;
  errMsg = false;
  validEmail = false;
  loadEmailSpinner = false;
  valueChanged = true;
  @ViewChild('workEmail') workEmail: ElementRef | undefined;
  @ViewChild(FormGroupDirective, { static: false }) formGroupDirective: any;
  isCandidateType:any;

  constructor(
    private formBuild: FormBuilder,
    private toastr: ToastrService,
    private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private activatedRoute:ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
     if(params['type'] == 'Employer'){
         this.isCandidateType = 'Employer';
       }else{
         this.isCandidateType = 'Candidate';
       }
    });
    

    this.contactusForm = formBuild.group({
      isCandidate: [this.isCandidateType, Validators.required],
      firstName: ['', Validators.required],
      // firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      lastName: ['', Validators.required],
      workEmail: ['', [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]],
      candEmail: ['', [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^(?!0+)[0-9()-\d]*$/)]],
      interestedIn: ['']


    });
  }

  ngOnInit(): void {
    this.contactusForm.controls['workEmail']
      .valueChanges
      .pipe(startWith(null), pairwise())
      .subscribe(() => {
        this.valueChanged = true;
      });
  }
  createContactUsForm() {
    if (this.valueChanged && this.contactusForm.value.isCandidate != 'Candidate') {
      this.validateEmail(true);
      return
    }
    if(this.contactusForm.value.isCandidate == 'Candidate'){
      this.contactusForm.controls.candEmail.setValidators([Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]);
      this.contactusForm.controls.workEmail.clearValidators();
    } else{
      this.contactusForm.controls.workEmail.setValidators([Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]);
      this.contactusForm.controls.candEmail.clearValidators();

    }
    this.contactusForm.controls.candEmail.updateValueAndValidity();
    this.contactusForm.controls.workEmail.updateValueAndValidity();
    if (!this.contactusForm.valid) {
      return;
    }
    console.log(this.contactusForm.value);
    let todo = {
      "isCandidate": (this.contactusForm.value.isCandidate == 'Candidate') ? 0 : 1,
      "firstName": this.auditlogService.encryptAES(this.contactusForm.value.firstName),
      "lastName": this.auditlogService.encryptAES(this.contactusForm.value.lastName),
      "workEmail": this.auditlogService.encryptAES((this.contactusForm.value.isCandidate == 'Candidate') ? this.contactusForm.value.candEmail : this.contactusForm.value.workEmail),
      "phoneNo": this.auditlogService.encryptAES(this.contactusForm.value.phoneNo),
      "interestedIn": this.auditlogService.encryptAES(this.contactusForm.value.interestedIn)


    }

    this.userService.contactus(todo).subscribe((response) => {
      // this.listTodos();
      console.log(response);

      // console.log(response.headers.get('inc-auth-token'));
      if (response && response.body && response.body.Error) {
        this.toastr.error(response.body.Message);
      }
      if (response && response.body && response.body.Success) {
        this.toastr.success(response.body.Message);
        this.formGroupDirective.resetForm();
        this.validEmail = false;
        this.contactusForm.controls.isCandidate.setValue('Candidate');
        // this.clearForm() {

        //   this.contactusForm.reset({
        //         'firstName': '',
        //         'lastName': '',
        //         'workEmail': '',
        //         'phoneNo': '',
        //         'interestedIn': ''

        //        });
        //   }

      }
    })
  }
  validateEmail(bool: Boolean) {
    if (this.contactusForm.controls.workEmail.valid) {
      let valueToPass = this.contactusForm.value.workEmail;
      this.contactusForm.controls.workEmail.disable();
      this.validEmail = false;
      this.errMsg = false;
      this.loadEmailSpinner = true;
      this.contactusForm.controls.workEmail.setErrors(null);
      this.userService.validateEmail(valueToPass).subscribe((response) => {
        // this.listTodos();
        this.contactusForm.controls.workEmail.enable();
        this.loadEmailSpinner = false;
        this.valueChanged = false;
        console.log(response);
        // balance: "31"
        // debounce:{
        //   code: "5"
        //   did_you_mean: ""
        //   email: "aditya@gmail.com"
        //   free_email: "true"
        //   reason: "Deliverable"
        //   result: "Safe to Send"
        //   role: "false"
        //   send_transactional: "1"
        // }
        // success: "1"

        if (response && response.debounce) {
          console.log(response.debounce.code);
          if (response.debounce.free_email == "true" || response.debounce.code == "6" || response.debounce.code == 6) {
            this.errMsg = true;
            this.contactusForm.controls.workEmail.setErrors({ invalidEmail: true });
            if (this.workEmail) {
              this.workEmail.nativeElement.focus();
            }
          } else {
            this.validEmail = true;
            if(bool){
              this.createContactUsForm();
            }
          }
          // if (response.debounce.free_email == "true" || response.debounce.code == "5") {
          //   this.toastr.error('Please enter Business Email');
          // }
        }
        // this.toastr.success(response.body.Message);
      },
        (error) => {
          console.log(error);
          this.contactusForm.controls.workEmail.enable();
          this.errMsg = true;
          this.loadEmailSpinner = false;
          this.contactusForm.controls.workEmail.setErrors(null);
          this.valueChanged = false;
          this.validEmail = true;
          if(bool){
            this.createContactUsForm();
          }
        })
    }
  }

}
