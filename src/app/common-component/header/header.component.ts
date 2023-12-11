import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { Emitters } from 'src/app/class/emitters/emitters';
import { UserAuthService } from 'src/app/user-auth.service';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'website1';
  year = (new Date().getFullYear())
  authenticated = false;
  isHome: any;
  isRedirectAssessmentPage = false;
  header:any;
  isLogin:any;
  isUploadResumeStatus=false;
  isdashboard = false;
  isCollapsed = false;

  isDesktop = window.innerWidth > 1024 ? true : false;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  logoUrl:any;

  constructor(private userService: UserAuthService,private router:Router, private cdref: ChangeDetectorRef,private auditlogService: AuditlogService) { }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe(
      (auth:boolean)=>{
          this.authenticated = auth;
      }

    );
    if(this.router.url =='/login'){
      this.isHome = false;
      this.isLogin = true;
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isUploadResumeStatus = false;
        this.isdashboard = false;
        // console.log(localStorage.getItem("isUploadResumeStatus"));
        // this.isUploadResumeStatus = localStorage.getItem("isUploadResumeStatus") == '2' ? true : false;
        // this.isHome = this.router.url == '/home' ? true : false;
        this.isCollapsed = true;
        this.isHome = false;
        this.isHome = this.router.url == '/home' ? true : false;
        if(this.router.url == '/home'
         || this.router.url == '/aboutus'
         || this.router.url == '/privacy'
         || this.router.url == '/cookies'
         || this.router.url == '/terms'
         || this.router.url == '/faqs'
         || this.router.url == '/contactus'
         || this.router.url == '/preference'
         || this.router.url == '/employerssubform'
         || this.router.url == '/jobconcierge'
         || this.router.url == '/interviewprep'
         || this.router.url == '/upskill-reskill'
         || this.router.url == '/incredibleresume'
         || this.router.url == '/allevents'
         || this.router.url == '/returnshipprogram'
         || this.router.url == '/talentcommunity'
         || this.router.url == '/hiretalent'
         || this.router.url == '/How-to-Make-the-Most-of-Working-with-a-Career-Coach'
         || this.router.url == '/the-role-of-subtle-repetition-on-your-resume-to-sell-your-story'
         || this.router.url == '/how-to-train-your-memory-for-a-job-interview'
         || this.router.url == '/6-reasons-for-employment-gaps-and-how-to-discuss-them-in-the-interview-process'
         || this.router.url == '/8-things-to-do-before-you-write-your-resume'
         || this.router.url == '/how-to-deal-with-the-spectre-of-loneliness-in-a-job-search'
         || this.router.url == '/how-to-engage-with-your-linkedin-connections-regularly-and-how-it-helps-the-job-search'
         || this.router.url == '/should-you-create-an-interview-script-or-go-with-the-flow'
         || this.router.url == '/what-sort-of-content-should-you-share-on-social-media-as-a-job-seeker'
         || this.router.url == '/why-you-should-talk-about-your-diversity-during-your-interview'
         || this.router.url == '/3-Ways-to-Make-Your-Cybersecurity-Resume-Stand-Out'
         || this.router.url == '/How-to-Build-a-Cybersecurity-Team-in-2022'
         || this.router.url == '/Breaking-into-Tech-Tips-for-Women'
         || this.router.url == '/The-Antidote-to-Candidate-Ghosting-Be-an-Employer-of-Choice'
         || this.router.url == '/All-Things-Considered-Preferred-Pronouns-Names-on-Resumes'
         || this.router.url == '/How-to-Be-Inclusive-During-the-Interview-Process'
         || this.router.url == '/How-to-Capture-an-Employers-Attention-This-Holiday-Season'
         || this.router.url == '/What-to-Consider-To-Find-a-Job-That-Makes-You-Happy'
         || this.router.url == '/4-Reasons-to-Be-Thankful-for-The-Job-Search-This-Season'
         || this.router.url == '/How-to-Determine-If-a-Companys-Culture-Is-Right-For-You?'
         || this.router.url == '/unsubscribe'
         || this.router.url == '/blog'){
          this.isHome = true;
        }

        //this.isLogin = this.router.url == '/login' ? true : false;
        this.isLogin = (this.router.url == ('/login') || this.router.url == ('/forgot-password') || this.router.url == ('/Signup')) ? true : false;
        
        this.isRedirectAssessmentPage = this.router.url == '/redirectassessment' ? true : false;
        
        if(localStorage.getItem("isUploadResumeStatus") == '2') {
          this.isUploadResumeStatus = true;
          this.isdashboard = false;
          this.logoUrl = environment.FrontEndURLForUser+ "dashboard";
        }else if((localStorage.getItem("isUploadResumeStatus") == '0') || localStorage.getItem("isUploadResumeStatus") == '1') {
          this.isUploadResumeStatus = false;
          this.isdashboard = true;
          this.logoUrl = environment.FrontEndURLForUser+ "upload-resume";
        }else{
          this.isUploadResumeStatus = false;
          this.isdashboard = false;
          this.logoUrl = environment.baseUrl;

        }

        //console.log(this.isHome)
      }
    // NavigationEnd
    // NavigationCancel
    // NavigationError
    // RoutesRecognized
      
    });

  }
  
   ngAfterContentChecked() {
   // this.isUploadResumeStatus = localStorage.getItem("isUploadResumeStatus") == '2' ? true : false;
    // debugger;

    if((localStorage.getItem("isUploadResumeStatus") == '2' && localStorage.getItem("locationfromCreateUploadResume") == '1')) {
      this.isUploadResumeStatus = false;
      this.isdashboard = false;
      //this.logoUrl = environment.FrontEndURLForUser+ "dashboard";

    } else if(localStorage.getItem("isUploadResumeStatus") == '2') {
      this.isUploadResumeStatus = true;
      this.isdashboard = false;
      this.logoUrl = environment.FrontEndURLForUser+ "dashboard";

    }else if((localStorage.getItem("isUploadResumeStatus") == '0') || localStorage.getItem("isUploadResumeStatus") == '1') {
      this.isUploadResumeStatus = false;
      this.isdashboard = true;
      this.logoUrl = environment.FrontEndURLForUser+ "upload-resume";

    }else{
      this.isUploadResumeStatus = false;
      this.isdashboard = false;
      this.logoUrl = environment.baseUrl;

    }
    this.cdref.detectChanges();
  }
  // ngAfterViewInit(){
  //   this.isUploadResumeStatus = localStorage.getItem("isUploadResumeStatus") == '2' ? true : false;

  // }  


  backtoresults(){
    localStorage.setItem("showPrevRecord","true");
    
    // this.router.navigate(['/find-jobs']);
    
    if(this.userService.getUserType() == 'true'){    
      this.router.navigate(['/jobs']);
    } else {    
      this.router.navigate(['/find-jobs']);
    }
  }
  logout():void {
     this.userService.logout();
     this.router.navigate(['/login']);
     this.authenticated = false;
     this.staticAuditLogAPI('134', '');
  }
  gotohome(){
    this.staticAuditLogAPI('132', '');
    this.router.navigate(['/home']);
  }
  staticAuditLogAPI(actionId: string, jsonString: string) {
    let num:any = (localStorage.getItem("userId")) ? (localStorage.getItem("userId")) : ''; //number
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
