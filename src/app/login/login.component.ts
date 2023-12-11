import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ConfigService } from './../config/config.service';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from '../shared/auditlog.service';
import { UserAuthService } from '../user-auth.service';
import { AssessmentCountService } from '../shared/services/assessment-count.service';
import { Emitters } from '../class/emitters/emitters';

// import {
//     AuthService,
//     // FacebookLoginProvider,
//     // GoogleLoginProvider,
//     // VkontakteLoginProvider,
//     LinkedinLoginProvider
// } from 'angular-6-social-login-v2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent  implements OnInit {

    // constructor( private socialAuthService: AuthService ) {}
  // constructor(private authService: SocialAuthService) { }
  isLoggedin:boolean = false;
  socialUser:any = '';

  
    code:any = '';
    state:any = '';
    access_token:any = '';
    postId:any;

    loginForm:any;
    submitted = false;
    showForm = true;
    hide = true;
    color = "accent";
    emailId:any;
    redirectTo:any;
    color1 = 'primary';
    emailFromProfileEmail:any;
    emailFromProfileEmaildecry:any
    emailFromemailFromMail:any;
    emailFromemailFromMaildecry:any;
    frontEndURL: any;
    indeedKey:any;
    indeedSecret:any;
    showSpinner = false;
    
    loginform_lsData:any;
    keepMeSignInForm:any;
    headers:any;
    authorization_header:any;
    formInProgress = false;
      // .set('Access-Control-Allow-Origin', '*')

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private authService: SocialAuthService,
    private userService: UserAuthService,
    private auditlogService:AuditlogService,
    private toastr: ToastrService,
    private router: Router, private formBuilder:FormBuilder,
    private countChange: AssessmentCountService
    ) { 
    this.frontEndURL = environment.FrontEndURLForUser;
    this.indeedKey = environment.indeedKey;
    this.indeedSecret = environment.indeedSecret;


    let encodedCode = btoa(this.indeedKey+":"+ this.indeedSecret);
    this.authorization_header = 'Basic ' + encodedCode;

    this.headers = new HttpHeaders()
      .set('Accept','application/json')
      // .set('Authorization', this.authorization_header)
      // .set('Access-Control-Allow-Origin', '*')
      // .set("Access-Control-Allow-Origin", encodeURIComponent(this.frontEndURL))
      // .set('Access-Control-Allow-Origin', 'http://localhost:4200/login')
      .set('content-type','application/x-www-form-urlencoded')
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  loginWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }


  //  loginWithLinkedIn(): void {
  //   this.socialAuthService.signIn(LinkedinLoginProvider.PROVIDER_ID).then(
  //     (userData) => {
  //       console.log(" sign in data : " + userData);
  //       // Now sign-in with userData
  //       // ...
            
  //     }
  //   );;
  // }


  signOut(): void {
    this.authService.signOut();
  }
  // // constructor() { }

  // ngOnInit(): void {
  //   this.authService.authState.subscribe((user) => {
  //     this.socialUser = user;
  //     this.isLoggedin = (user != null);
  //     console.log(this.socialUser);
  //   });
  // }

  

  private getForLinkedInAccessToken():void{
    
    // , { redirect_uri:'http%3A%2F%2Flocalhost%3A4200%2Flogin', code: this.code, grant_type:'authorization_code', client_id:'86xsmltotkq5gd', client_secret:'R2gVKuCjtVcPKfzD' }
// ?grant_type=authorization_code&code='+this.code+'&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&client_id=86xsmltotkq5gd&client_secret=R2gVKuCjtVcPKfzD'
        // ?grant_type=authorization_code&code='+this.code+'&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&client_id=86xsmltotkq5gd&client_secret=R2gVKuCjtVcPKfzD

        var obj = { redirect_uri:'http%3A%2F%2Flocalhost%3A4200%2Flogin', code: this.code, grant_type:'authorization_code', client_id:'86xsmltotkq5gd', client_secret:'R2gVKuCjtVcPKfzD' };
        this.http.post<any>('https://www.linkedin.com/oauth/v2/accessToken', (obj) ,{'headers':this.headers}).subscribe(data => {
          console.log(data);
            // this.postId = data.id;
        })
  }

  private getForIndeedAccessToken():void{
    
    // , { redirect_uri:'http%3A%2F%2Flocalhost%3A4200%2Flogin', code: this.code, grant_type:'authorization_code', client_id:'86xsmltotkq5gd', client_secret:'R2gVKuCjtVcPKfzD' }
// ?grant_type=authorization_code&code='+this.code+'&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&client_id=86xsmltotkq5gd&client_secret=R2gVKuCjtVcPKfzD'
        // ?grant_type=authorization_code&code='+this.code+'&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&client_id=86xsmltotkq5gd&client_secret=R2gVKuCjtVcPKfzD
        
        // var body = `redirect_uri=`+(`http%3A%2F%2Flocalhost%3A4200%2Flogin%2F&code=`) +this.code + `&grant_type=authorization_code&client_id=`+ this.indeedKey +`&client_secret=` + this.indeedSecret;
        var body = 'redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin%2F';

        // var aa = `redirect_uri=`+(encodeURIComponent(this.frontEndURL));

        var obj = { 
          'grant_type':'authorization_code',
          'code': this.code, 
          'redirect_uri': ('http://localhost:4200/login/')
          , 
          // ,
          // authorization : this.authorization_header
        
         'client_id': this.indeedKey, 
         'client_secret':this.indeedSecret
          };

          //http://localhost:4200/login/
          //http%3A%2F%2Flocalhost%3A4200%2Flogin%2F
          var myObj = {
              'Accept':'application/json',
              'content-type':'application/x-www-form-urlencoded'
          }
        this.http.post<any>('https://apis.indeed.com/oauth/v2/tokens', (obj), {'headers':this.headers}).subscribe(data => {
          console.log(data);
            // this.postId = data.id;
        })
  }


  checkVersion(version:any){
    this.userService.checkVersion(version).subscribe((response: any) => {
         
         if(response.Error){
           window.location.reload();

         }
 
       }, (error => {
 
       }));

  }

  isMobile:any;
  ngOnInit(): void {

    //this.isMobile = (window.innerWidth < 990) ? true : false;


    var reloadnum = Number(localStorage.getItem('reloaded')) || '0' ;
    reloadnum = Number(reloadnum);
    if(reloadnum && reloadnum == 2){
      localStorage.removeItem('reloaded');
    }  else {
      this.checkVersion(environment.buildVersion);
      reloadnum = reloadnum+1;
      localStorage.setItem('reloaded',reloadnum.toString());

    }
    if (!this.userService.isUserLoggedIn()) {

      // this.router.navigate(['/login']);
       Emitters.authEmitter.emit(false);
     } else {
      // this.staticAuditLogAPI('82', '');
       Emitters.authEmitter.emit(true);
       this.router.navigate(['/dashboard']);
    
     }

     
    this.route.queryParams
      .subscribe(params => {
        console.log(params); 
        this.code = params.code;
        this.state = params.state;
        console.log(this.code);
        if(this.code && this.state == "indeed-login"){
            // this.getForIndeedAccessToken();

          this.showForm = false;
          this.showSpinner = true;


          let todo = {"connectiontoken":"",
                    "token":this.code
                    }


          this.userService.getSocialLoginData(todo).subscribe((response)=>{
            console.log(response);
            if(response.body.Success){ 
            //   this.userService.setToken(response.headers.get('csn-auth-token'));
            // console.log(response);
            //   var myResp = response;
              // parent.postMessage("anil", window.location.origin);


                      // localStorage.removeItem('source');
                      localStorage.removeItem('KeepmeSignedIn');
                      this.userService.setToken(response.headers.get('csn-auth-token'));
                      this.userService.setUserType(response.body.userType);        
                      this.userService.setUserId(response.body.userId);
                      
              localStorage.setItem('firstName', response.body.firstName);
              localStorage.setItem('lastName', response.body.lastName);
              localStorage.setItem('email', response.body.email);
                      // debugger;
                      localStorage.setItem("isUploadResumeStatus","0");
                        localStorage.setItem("completedAssessments",response.body.completedAssessments);
                        localStorage.setItem("totalAssessments",response.body.totalAssessments);
                        this.countChange.updateCount(response.body.completedAssessments);
                        this.countChange.updateTotal(response.body.totalAssessments);
                      // this.router.navigate(['/find-jobs']);
                      if(response.body.isUploadResumeStatus == 0){
                        this.router.navigate(['/upload-resume']);
                    } else if (response.body.isUploadResumeStatus == 1){ 
                        this.router.navigate(['/create-upload-resume']);
                    } else {
                            this.router.navigate(['/dashboard']);                
                        
                    }
                      // setTimeout(() => {
                      //   window.location.reload();
                      // }, 200);
                
            }
            if(response.body.Error){  
              this.showSpinner = false;

              this.showForm = true;
                          this.toastr.error(response.body.Message);
                              this.router.navigate(['/login']);  
            // console.log(response);
            //   var errorObj = {
            //     'message':response.body.Message
            //   };      
            //   parent.postMessage(errorObj, window.location.origin);
            }
          },(error=>{
              this.showForm = true;
          this.showSpinner = false;

          }));

        }
        else if(this.code && this.state == "987654321"){
            this.getForLinkedInAccessToken();
        }

        // redirect To
         this.redirectTo = params.redirectTo;
        //console.log(redirectTo);
        if (this.redirectTo == 'profile' && this.userService.isUserLoggedIn() && localStorage.getItem("isUploadResumeStatus") == '2'){
          this.router.navigate(['/profile']);
        }else if (this.redirectTo == 'profile' && this.userService.isUserLoggedIn() && localStorage.getItem("isUploadResumeStatus") == '1'){
          this.router.navigate(['/create-upload-resume']);
        }else if (this.redirectTo == 'profile' && this.userService.isUserLoggedIn() && localStorage.getItem("isUploadResumeStatus") == '0'){
          this.router.navigate(['/upload-resume']);
        }else{
          if(localStorage.getItem('emailFromProfile')){
            this.emailFromProfileEmail = (localStorage.getItem('emailFromProfile'));
           this.emailFromProfileEmaildecry = this.auditlogService.decryptAES(this.emailFromProfileEmail.replace(/\ /g, '+'))
            if(this.emailFromProfileEmaildecry) {
              this.emailId =  {value:this.emailFromProfileEmaildecry,disabled:true};
            }
          } else {
            if(localStorage.getItem('emailFromMail')){
              this.emailFromemailFromMail = (localStorage.getItem('emailFromMail'));
              this.emailFromemailFromMaildecry = this.auditlogService.decryptAES(this.emailFromemailFromMail.replace(/\ /g, '+'));
              if(this.emailFromemailFromMaildecry) {
                this.emailId =  {value:this.emailFromemailFromMaildecry,disabled:true}; 
              }
              // this.emailId =  {value:localStorage.getItem('emailFromMail'),disabled:true}; 
           } else {
               if(params.email) {
                  this.emailId = {value:params.email,disabled:true}
                }

            }
          }
        }
      }
      
    );

        this.authService.authState.subscribe((user) => {
          this.socialUser = user;
          this.isLoggedin = (user != null);
          console.log(this.socialUser);
        });
      
        if(this.userService.isUserLoggedIn() && localStorage.getItem("isUploadResumeStatus") == '0'){
          this.router.navigate(['/upload-resume']);
        }

       
        if(localStorage.getItem('KeepmeSignedIn')){
           this.loginform_lsData = localStorage.getItem('KeepmeSignedIn');
           this.keepMeSignInForm =   JSON.parse(this.loginform_lsData);
           this.loginForm  = this.formBuilder.group({
            email : new FormControl(this.keepMeSignInForm.email, [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]),
            password:new FormControl(this.keepMeSignInForm.password, [Validators.required]),
            check: new FormControl(this.keepMeSignInForm.check)
          });
         
        }else{
          this.loginForm  = this.formBuilder.group({
            email : new FormControl(this.emailId, [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]),
            password:new FormControl('', [Validators.required]),
            check: new FormControl(true)
          });
        }
        

  }

  
 windowRef:any = null;

  openWindow(type:any):void{
    // alert(123);
    //http%3A%2F%2Flocalhost%3A4200%2Fsocial-connect
    //http%3A%2F%2F35.155.202.216%3A8080%2FCSNinja-APIS%2Fconnection_token
    this.windowRef = window.open('https://app-1084729-1.api.oneall.com/socialize/connect/direct/'+type+'/?nonce=' + encodeURIComponent ('18881239-fddb-4b7c-b384-998177c61815') + '&callback_uri=' + encodeURIComponent(this.frontEndURL) + 'social-connect', '_self', 'location=no,height=570,width=520,scrollbars=yes,status=yes');
    
    // this.windowRef.addEventListener("message",this.receivemessage.bind(this), false);
  }


  openIndeed(): void{
    this.windowRef = window.open('https://secure.indeed.com/oauth/v2/authorize?client_id='+this.indeedKey+'&redirect_uri=' + (this.frontEndURL) + 'login&response_type=code&state=indeed-login&scope=email+offline_access+employer_access&display=popup', '_self', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  }

  receivemessage(evt:any){
    console.log("reached");
    console.log(evt.data);
    // if(evt.data.body && evt.data.body.Success){

    //       localStorage.removeItem('source');
    //       localStorage.removeItem('KeepmeSignedIn');
    //       // this.userService.setToken(evt.data.headers.get('csn-auth-token'));
    //       this.userService.setUserType(evt.data.body.userType);        
    //       this.userService.setUserId(evt.data.body.userId);
    //       // debugger;
    //       localStorage.setItem("isUploadResumeStatus","0");
    //         localStorage.setItem("completedAssessments",evt.data.body.completedAssessments);
    //         localStorage.setItem("totalAssessments",evt.data.body.totalAssessments);
    //         this.countChange.updateCount(evt.data.body.completedAssessments);
    //         this.countChange.updateTotal(evt.data.body.totalAssessments);
    //       this.router.navigate(['/find-jobs']);
    //       if(evt.data.body.isUploadResumeStatus == 0){
    //           this.router.navigate(['/find-jobs']);
    //       } else if (evt.data.body.isUploadResumeStatus == 1){ 
    //           this.router.navigate(['/create-upload-resume']);
    //       } else {
    //               this.router.navigate(['/find-jobs']);                
              
    //       }
    //       setTimeout(() => {
    //         window.location.reload();
    //       }, 200);
    // } else if(evt.data.body && evt.data.body.Error){

    //         if(evt.data.body.Error){        
    //           this.toastr.error(evt.data.body.Message);
    //         }
    // }

  }
  createLoginForm():void {

    this.submitted = true;

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

        this.formInProgress = true;

      this.userService.login(todo).subscribe((response)=>{
        // this.listTodos();
        console.log(response);
        this.formInProgress = false;
        // console.log(response.headers.get('inc-auth-token'));
        if(response && response.body && response.body.Error){        
          this.toastr.error(response.body.Message);
        }
        if(response && response.body && response.body.Success){
          
        
          // this.token = response.headers('ask-auth-token');
         // localStorage.setItem("userInfo", JSON.stringify($rootScope.UserInfo));
           
            if(this.loginForm.value && this.loginForm.value.check) {
              localStorage.setItem('KeepmeSignedIn', JSON.stringify(this.loginForm.value) )
            }else{
              localStorage.removeItem('KeepmeSignedIn');
            }
          

            // let userData = { "user" : response.userId, "userToken" : 'anil'}
            // localStorage.setItem('userData', btoa(JSON.stringify(userData)));
          //localStorage.setItem("userToken", 'anil');
          // localStorage.setItem("CopyrightsFooter", $rootScope.CopyrightsFooter);
          // this.newItemEvent.emit(response.userId);
          this.userService.setToken(response.headers.get('csn-auth-token'));
          this.userService.setUserId(response.body.userId);
          this.userService.setUserType(response.body.userType);   
          
              localStorage.setItem('firstName', response.body.firstName);
              localStorage.setItem('lastName', response.body.lastName);
              localStorage.setItem('email', response.body.email);


          localStorage.setItem("isUploadResumeStatus",response.body.isUploadResumeStatus);
          // localStorage.setItem("completedAssessments",response.body.completedAssessments);
          // localStorage.setItem("totalAssessments",response.body.totalAssessments);
          // this.countChange.updateCount(response.body.completedAssessments);
          // this.countChange.updateTotal(response.body.totalAssessments);


          if(localStorage.getItem("pageFrom") == 'accuick' && localStorage.getItem('jobData')){
            // this.router.navigate(['/thankyou-for-apply']);
            this.router.navigate(['/thanks-for-applying']);
            return;
          } else if(localStorage.getItem("pageFrom") == 'assessments'){
            this.router.navigate(['/assessments']);
            return;
          }
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
        this.formInProgress = false;

      }));


  

  }



}
