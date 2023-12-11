import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { NgbModule } from 'ngx-bootstrap/ng-bootstrap';
// import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxNavbarModule } from 'ngx-bootstrap-navbar';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { SlickCarouselModule } from 'ngx-slick-carousel';

import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { DeviceDetectorService } from 'ngx-device-detector';
// import { LinkedInLoginProvider } from 'angular4-social-login';
// import { AngularSocialLoginButtonsModule, AngularSocialLoginButtonsService } from 'angular-social-login-buttons';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { LoginComponent } from './login/login.component';
import { LinkedinSuccessComponent } from './linkedin-success/linkedin-success.component';
import { SignupComponent } from './signup/signup.component';
// import { AngularMaterialComponent } from './angular-material/angular-material.component';
import { UploadResumeComponent } from './upload-resume/upload-resume.component';

import { MaterialModule } from './shared/material/material.module';
import { ToastrModule } from 'ngx-toastr';
import { MomentModule } from 'ngx-moment';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreateUploadResumeComponent } from './create-upload-resume/create-upload-resume.component';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { QuillModule } from 'ngx-quill';
import { AuthGuard } from './auth/auth.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmEqualValidatorDirective } from './shared/directives/confirm-equal-validator.directive';
import { ResumeModule } from './resume/resume.module';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { EmploymentFormComponent } from './employment-form/employment-form.component';
import { HeaderComponent } from './common-component/header/header.component';
import { FooterComponent } from './common-component/footer/footer.component';
import { JobsComponent } from './jobs/jobs.component';
import { EducationFormComponent } from './education-form/education-form.component';
import { TrainingFormComponent } from './training-form/training-form.component';
import { SocialLinkFormComponent } from './social-link-form/social-link-form.component';
import { LanguagesFormComponent } from './languages-form/languages-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHeaderComponent } from './common-component/dashboard-header/dashboard-header.component';
import { DashboardLeftMenuComponent } from './common-component/dashboard-left-menu/dashboard-left-menu.component';
import { ProfileComponent } from './profile/profile.component';
import { BasicInfoFormComponent } from './basic-info-form/basic-info-form.component';
import { SummaryFormComponent } from './summary-form/summary-form.component';
import { SkillsFormComponent } from './skills-form/skills-form.component';
import { LicenceCertificateFormComponent } from './licence-certificate-form/licence-certificate-form.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { UploadCertfileComponent } from './licence-certificate-form/upload-certfile/upload-certfile.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditProfileComponent } from './common-component/modals/edit-profile/edit-profile.component';
import { UpdatePasswordComponent } from './common-component/modals/update-password/update-password.component';
import { ShowJobComponent } from './common-component/modals/show-job/show-job.component';
import { BuilderComponent } from './builder/builder.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PreferenceComponent } from './preference/preference.component';
import { SettingComponent } from './setting/setting.component';
import { EmployerssubformComponent } from './employerssubform/employerssubform.component';
import { JobconciergeComponent } from './jobconcierge/jobconcierge.component';
import { InterviewprepComponent } from './interviewprep/interviewprep.component';
import { UpskillReskillComponent } from './upskill-reskill/upskill-reskill.component';
import { IncredibleresumeComponent } from './incredibleresume/incredibleresume.component';
import { AlleventsComponent } from './allevents/allevents.component';
import { AutoFocusDirectiveDirective } from './shared/directives/auto-focus-directive.directive';
import { ShowProfileComponent } from './common-component/modals/show-profile/show-profile.component';
import { BlogContentForm1Component } from './blog-content-form1/blog-content-form1.component';
import { BlogContentForm2Component } from './blog-content-form2/blog-content-form2.component';
import { BlogContentForm3Component } from './blog-content-form3/blog-content-form3.component';
import { BlogContentForm4Component } from './blog-content-form4/blog-content-form4.component';
import { BlogslistComponent } from './blogslist/blogslist.component';
import { BlogContentForm5Component } from './blog-content-form5/blog-content-form5.component';
import { BlogContentForm6Component } from './blog-content-form6/blog-content-form6.component';
import { BlogContentForm7Component } from './blog-content-form7/blog-content-form7.component';
import { BlogContentForm8Component } from './blog-content-form8/blog-content-form8.component';
import { BlogContentForm9Component } from './blog-content-form9/blog-content-form9.component';
import { BlogContentForm10Component } from './blog-content-form10/blog-content-form10.component';
import { DeleteConfirmDialogComponent } from './common-component/modals/delete-confirm-dialog/delete-confirm-dialog.component';
import { BlogContentForm11Component } from './blog-content-form11/blog-content-form11.component';
import { BlogContentForm12Component } from './blog-content-form12/blog-content-form12.component';
import { BlogContentForm13Component } from './blog-content-form13/blog-content-form13.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { BlogContentForm14Component } from './blog-content-form14/blog-content-form14.component';

import { MobDirective } from '../app/mask';
import { BlogContentForm15Component } from './blog-content-form15/blog-content-form15.component';
import { BlogContentForm16Component } from './blog-content-form16/blog-content-form16.component';
import { BlogContentForm17Component } from './blog-content-form17/blog-content-form17.component';
import { BlogContentForm18Component } from './blog-content-form18/blog-content-form18.component';
import { BlogContentForm19Component } from './blog-content-form19/blog-content-form19.component';
import { BlogContentForm20Component } from './blog-content-form20/blog-content-form20.component';
import { TestpageComponent } from './testpage/testpage.component';
import { PackagesComponent } from './packages/packages.component';
import { HirerightformComponent } from './hirerightform/hirerightform.component';
import { HireRightResultComponent } from './hire-right-result/hire-right-result.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { RedirectAssessmentComponent } from './redirect-assessment/redirect-assessment.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { EditVerifyMobileNumberComponent } from './common-component/modals/edit-verify-mobile-number/edit-verify-mobile-number.component';
import { ClipboardComponent } from './common-component/modals/clipboard/clipboard.component';
import { FiltersComponent } from './common-component/modals/filters/filters.component';
import { EditCommuteComponent } from './common-component/modals/edit-commute/edit-commute.component';
import { FindJobsComponent } from './find-jobs/find-jobs.component';
import { ThankyouForApplyJobComponent } from './thankyou-for-apply-job/thankyou-for-apply-job.component';
import { NgAudioRecorderModule } from 'ng-audio-recorder';
import { RecordAudioComponent } from './record-audio/record-audio.component';
import { ViewProfileComponent } from './common-component/modals/view-profile/view-profile.component';
import { FilterPipe } from './pipes/filter.pipe';
import { DateconvertPipe } from './shared/pipe/dateconvert.pipe';
import { TokenexpireService } from './shared/services/tokenexpire.service';
import { ApplyJobsComponent } from './apply-jobs/apply-jobs.component';
import { ShowApplyJobComponent } from './common-component/modals/show-apply-job/show-apply-job.component';
import { ThanksForJoiningComponent } from './thanks-for-joining/thanks-for-joining.component';
import { BasicInfoNotFoundComponent } from './common-component/modals/basic-info-not-found/basic-info-not-found.component';
import { ThanksForApplyingComponent } from './thanks-for-applying/thanks-for-applying.component';
import { AlreadyJobAppliedComponent } from './already-job-applied/already-job-applied.component';
import { ApplyJobsResumeComponent } from './apply-jobs/apply-jobs-resume.component';
import { JobApplyResumeComponent } from './job-apply-resume/job-apply-resume.component';
import { ShowCandidateBenefitsComponent } from './common-component/modals/show-candidate-benefits/show-candidate-benefits.component';
import { VerifyEmailAccountComponent } from './common-component/modals/verify-email-account/verify-email-account.component';
import { VerifiedEmailContinueApplyComponent } from './verified-email-continue-apply/verified-email-continue-apply.component';


import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

//import { AgmCoreModule } from '@agm/core';
// import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';
import { environment } from '../environments/environment';

// const googleMapsParams = {
//   apiKey: environment.GOOGLE_MAPS_API_KEY,
//   libraries: ['places'],
//   language: 'en',
//   // region: 'DE'
// };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutusComponent,
    LoginComponent,
    LinkedinSuccessComponent,
    SignupComponent,
    // AngularMaterialComponent,
    ForgotPasswordComponent,
    CreateUploadResumeComponent,
    UploadResumeComponent,
    BasicInfoComponent,
    ResetPasswordComponent,
    ConfirmEqualValidatorDirective,
    EmploymentFormComponent,
    HeaderComponent,
    FooterComponent,
    JobsComponent,
    EducationFormComponent,
    TrainingFormComponent,
    SocialLinkFormComponent,
    LanguagesFormComponent,
    BasicInfoFormComponent,
    SummaryFormComponent,
    DashboardComponent,
    DashboardHeaderComponent,
    DashboardLeftMenuComponent,
    ProfileComponent,
    SkillsFormComponent,
    LicenceCertificateFormComponent,
    PrivacyComponent,
    TermsComponent,
    UploadCertfileComponent,
    EditProfileComponent,
    UpdatePasswordComponent,
    ShowJobComponent,
    BuilderComponent,
    FaqsComponent,
    ContactusComponent,
    PreferenceComponent,
    SettingComponent,
    EmployerssubformComponent,
    JobconciergeComponent,
    InterviewprepComponent,
    UpskillReskillComponent,
    IncredibleresumeComponent,
    AlleventsComponent,
    AutoFocusDirectiveDirective,
    ShowProfileComponent,
    BlogContentForm1Component,
    BlogContentForm2Component,
    BlogContentForm3Component,
    BlogContentForm4Component,
    BlogslistComponent,
    BlogContentForm5Component,
    BlogContentForm6Component,
    BlogContentForm7Component,
    BlogContentForm8Component,
    BlogContentForm9Component,
    BlogContentForm10Component,
    DeleteConfirmDialogComponent,
    BlogContentForm11Component,
    BlogContentForm12Component,
    BlogContentForm13Component,
    UnsubscribeComponent,
    BlogContentForm14Component,

    MobDirective,
    BlogContentForm15Component,
    BlogContentForm16Component,
    BlogContentForm17Component,
    BlogContentForm18Component,
    BlogContentForm19Component,
    BlogContentForm20Component,
    TestpageComponent,
    PackagesComponent,
    HirerightformComponent,
    HireRightResultComponent,
    AssessmentsComponent,
    RedirectAssessmentComponent,
    AssessmentComponent,
    EditVerifyMobileNumberComponent,
    ClipboardComponent,
    FiltersComponent,
    EditCommuteComponent,
    FindJobsComponent,
    ThankyouForApplyJobComponent,
    RecordAudioComponent,
    ViewProfileComponent,
    FilterPipe,
    DateconvertPipe,
    ApplyJobsComponent,
    ShowApplyJobComponent,
    ThanksForJoiningComponent,
    BasicInfoNotFoundComponent,
    ThanksForApplyingComponent,
    AlreadyJobAppliedComponent,
    ApplyJobsResumeComponent,
    JobApplyResumeComponent,
    ShowCandidateBenefitsComponent,
    VerifyEmailAccountComponent,
    VerifiedEmailContinueApplyComponent,
  ],
  imports: [
    InfiniteScrollModule,
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAPS_API_KEY, //AIzaSyDU2gtuDLdiMfEFTygfm-vCEO7UwH-AbBM , AIzaSyBPvFpashJv6w5SFk_7HVO3Y_STF3NN3BQ
      libraries: ['places']
    }),
    GooglePlaceModule,
    ClipboardModule,
    HttpClientModule,
    NgbModule,
    NgxNavbarModule,
    // BsDropdownModule.forRoot(),
    // TooltipModule.forRoot(),
    // ModalModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    SocialLoginModule,
    MaterialModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    // CKEditorModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          // [{ 'direction': 'rtl' }],                         // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          // [{ 'font': [] }],
          [{ align: [] }],

          ['clean'], // remove formatting button

          // ['link', 'image', 'video']
        ],
      },
    }),
    NgxBootstrapIconsModule.pick(allIcons),
    ResumeModule,
    MomentModule,
    NgxDropzoneModule,
    // AgmCoreModule.forRoot(googleMapsParams),
    // MatGoogleMapsAutocompleteModule,
    CarouselModule.forRoot(),
    NgAudioRecorderModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '249519555702-lhhd4k3a8gjaso6d6rhnhc4igeal86eh.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2948863242048248'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    AuthGuard,
    BsModalRef,
    BsModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenexpireService,
      multi: true,
    },
    // ,
    //  {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: FacebookLoginProvider.PROVIDER_ID,
    //         provider: new FacebookLoginProvider(
    //           '2948863242048248'
    //         )
    //       }
    //     ]
    //   } as SocialAuthServiceConfig,
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
