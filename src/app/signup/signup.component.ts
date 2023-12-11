import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { AuditlogService } from '../shared/auditlog.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AssessmentCountService } from '../shared/services/assessment-count.service';
import { CustomValidators } from 'custom-validators';
import { loadavg } from 'os';

declare const _oneall: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();

  public loginForm: FormGroup;
  submitted = false;
  hide = true;
  formInProgress = false;
  color = 'accent';
  userInfoObj: any;
  frontEndURL: any;
  indeedKey: any;
  singInColor = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private countChange: AssessmentCountService
  ) {
    this.frontEndURL = environment.FrontEndURLForUser;
    this.indeedKey = environment.indeedKey;

    this.loginForm = this.createSignupForm();

    // this.loginForm  = this.formBuilder.group({
    //   email : new FormControl('', [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]),
    //   // password:new FormControl('', [Validators.required]),
    //   firstName:new FormControl('', [Validators.required]),
    //   lastName:new FormControl('', [Validators.required])
    // });
  }

  uid_v4 = function () {
    var g4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      g4() +
      g4() +
      '-' +
      g4() +
      '-' +
      g4() +
      '-' +
      g4() +
      '-' +
      g4() +
      g4() +
      g4()
    );
  };

  nonce: any = this.uid_v4();
  windowRef: any = null;

  openWindow(type: any): void {
    // alert(123);
    //http%3A%2F%2Flocalhost%3A4200%2Fsocial-connect
    //http%3A%2F%2F35.155.202.216%3A8080%2FCSNinja-APIS%2Fconnection_token
    this.windowRef = window.open(
      'https://app-1084729-1.api.oneall.com/socialize/connect/direct/' +
        type +
        '/?nonce=' +
        encodeURIComponent(this.nonce) +
        '&callback_uri=' +
        encodeURIComponent(this.frontEndURL) +
        'social-connect',
      '_self',
      'location=no,height=570,width=520,scrollbars=yes,status=yes'
    );

    // this.windowRef.addEventListener("message",this.receivemessage.bind(this), false);
  }

  //id : 7f41545247c7c9aebdc656d255b104ea9fb764f56aea032005111f41f3f30034
  //secret :  UKpkBefYF8JN98L3LTP7n2V24LPpOIqaECKyPMdjdZWcKsFuOQP5UkujZUjjSBzT
  openIndeed(): void {
    // this.windowRef = window.open('https://secure.indeed.com/oauth/v2/authorize?client_id='+this.indeedKey+'&redirect_uri=' + encodeURIComponent(this.frontEndURL) + 'login&response_type=code&state=indeed-login&scope=email+offline_access+employer_access', '_self', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    this.windowRef = window.open(
      'https://secure.indeed.com/oauth/v2/authorize?client_id=' +
        this.indeedKey +
        '&redirect_uri=' +
        this.frontEndURL +
        'login&response_type=code&state=indeed-login&scope=email+offline_access+employer_access&display=popup',
      '_self',
      'location=yes,height=570,width=520,scrollbars=yes,status=yes'
    );
  }

  receivemessage(evt: any) {
    console.log('reached');
    console.log(evt.data);
    if (evt.data.body && evt.data.body.Success) {
      localStorage.removeItem('source');
      localStorage.removeItem('KeepmeSignedIn');
      // this.userService.setToken(evt.data.headers.get('csn-auth-token'));
      this.userService.setUserType(evt.data.body.userType);
      this.userService.setUserId(evt.data.body.userId);
      // debugger;
      localStorage.setItem('isUploadResumeStatus', '0');
      localStorage.setItem(
        'completedAssessments',
        evt.data.body.completedAssessments
      );
      localStorage.setItem('totalAssessments', evt.data.body.totalAssessments);
      this.countChange.updateCount(evt.data.body.completedAssessments);
      this.countChange.updateTotal(evt.data.body.totalAssessments);
      this.router.navigate(['/find-jobs']);
      if (evt.data.body.isUploadResumeStatus == 0) {
        this.router.navigate(['/find-jobs']);
      } else if (evt.data.body.isUploadResumeStatus == 1) {
        this.router.navigate(['/create-upload-resume']);
      } else {
        this.router.navigate(['/dashboard']);
      }
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } else if (evt.data.body && evt.data.body.Error) {
      if (evt.data.body.Error) {
        this.toastr.error(evt.data.body.Message);
      }
    }
  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        email: [
          null,
          Validators.compose([
            Validators.email,
            Validators.required,
            Validators.pattern(
              /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
            ),
          ]),
        ],
        firstName: [null, Validators.compose([Validators.required])],
        lastName: [null, Validators.compose([Validators.required])],
        password: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            // check whether the entered password has a special character
            // CustomValidators.patternValidator(
            //   /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            //   {
            //     hasSpecialCharacters: true
            //   }
            // ),

            Validators.minLength(8),
          ]),
        ],
        //confirmPassword: [null, Validators.compose([Validators.required])]
      }
      // {
      //   // check whether our password and confirm password match
      //   validator: CustomValidators.passwordMatchValidator
      // }
    );
  }

  myFunction() {
    alert('test1');
  }


  checkVersion(version:any){
    this.userService.checkVersion(version).subscribe((response: any) => {
         
         if(response.Error){
           window.location.reload();

         }
 
       }, (error => {
 
       }));

  }

  ngOnInit(): void {
    // this.listTodos();
    // this.toastr.success('Hello world!');
    // this.newItemEvent.emit('hhhh');
    var reloadnum = Number(localStorage.getItem('reloaded')) || '0' ;
    reloadnum = Number(reloadnum);
    if(reloadnum && reloadnum == 2){
      localStorage.removeItem('reloaded');
    }  else {
      this.checkVersion(environment.buildVersion);
      reloadnum = reloadnum+1;
      localStorage.setItem('reloaded',reloadnum.toString());

    }
    if (this.userService.isUserLoggedIn()) {
      this.router.navigate(['/find-jobs']);
    }

    // _oneall.push(
    //   ['social_link', 'set_providers', ['google',"LinkedIn",'facebook']],
    //   ['social_link', 'set_callback_uri', window.location.href],
    //   ['social_link', 'set_custom_css_uri', 'https://secure.oneallcdn.com/css/api/themes/flat_w188_h32_wc_v1.css'],
    //   ['social_link', 'do_render_ui', 'social-login-container'],
    //   ['social_login', 'do_login', 'google']
    //   );

    // ['social_login', 'set_callback_uri', 'http://35.155.202.216:8080/CSNinja-APIS/connection_token'],
    // ['social_login', 'set_event', 'on_login_end_success', this.myFunction()]
  }

  // listTodos(){
  //   this.userService.list().subscribe((response)=>{
  //     this.todoList = response;
  //   },(error=>{

  //   }));
  // }

  // loadSocialLink(){
  //   _oneall.push(
  //     ['social_login', 'set_providers', ['google',"LinkedIn",'facebook']],
  //     ['social_login', 'set_callback_uri', window.location.href],
  //     ['social_login', 'set_custom_css_uri', 'https://secure.oneallcdn.com/css/api/themes/flat_w188_h32_wc_v1.css'],
  //     ['social_login', 'do_render_ui', 'social-login-container']);
  //  }

  createLoginForm(): void {
    this.submitted = true;

    if (!this.loginForm.valid) {
      return;
    }
    this.formInProgress = true;
    let todo = {
      email: this.auditlogService.encryptAES(this.loginForm.value.email),
      password: this.auditlogService.encryptAES(this.loginForm.value.password),
      firstName: this.auditlogService.encryptAES(
        this.loginForm.value.firstName
      ),
      lastName: this.auditlogService.encryptAES(this.loginForm.value.lastName),
      source:
        localStorage.getItem('source') || '{}'
          ? localStorage.getItem('source') || '{}'
          : 'cxninja',
      sourceLookupId: 10002002,
      communityId: 1000,
      status: 1,
    };

    console.log(this.loginForm.value);
    this.userService.signup(todo).subscribe(
      (response) => {
        // this.listTodos();
        this.formInProgress = false;
        console.log(response);
        if (response.body.Error) {
          this.toastr.error(response.body.Message);
        }
        if (response.body.Success) {
          // this.token = response.headers('ask-auth-token');
          // localStorage.setItem("userInfo", JSON.stringify($rootScope.UserInfo));
          //localStorage.setItem("userToken", 'anil');
          //this.userService.setToken('Thank you God');
          // localStorage.setItem("CopyrightsFooter", $rootScope.CopyrightsFooter);
          // this.newItemEvent.emit(response.userId);
          //this.router.navigate(['/find-jobs']);
          //debugger;
          // localStorage.removeItem('source');
          localStorage.removeItem('KeepmeSignedIn');
          this.userService.setToken(response.headers.get('csn-auth-token'));
          this.userService.setUserType(response.body.userType);
          this.userService.setUserId(response.body.userId);

            
          
          localStorage.setItem('firstName', response.body.firstName);
          localStorage.setItem('lastName', response.body.lastName);
          localStorage.setItem('email', response.body.email);
          

          localStorage.setItem('isUploadResumeStatus', '0');
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
          this.router.navigate(['/upload-resume']);
        }
        // this.router.navigate(['items'], { relativeTo: this.route });
      },
      (error) => {
        this.formInProgress = false;
      }
    );
  }
}
