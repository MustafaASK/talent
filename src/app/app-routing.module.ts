import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { CategoryListResolverService } from './category-list-resolver.service';
// resolve: { products: CategoryListResolverService }

import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { LoginComponent } from './login/login.component';
import { LinkedinSuccessComponent } from './linkedin-success/linkedin-success.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreateUploadResumeComponent } from './create-upload-resume/create-upload-resume.component';
import { UploadResumeComponent } from './upload-resume/upload-resume.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './auth/auth.guard';
import { JobsComponent } from './jobs/jobs.component';
import { FindJobsComponent } from './find-jobs/find-jobs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
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
import { ShowProfileComponent } from './common-component/modals/show-profile/show-profile.component';
import { ViewProfileComponent } from './common-component/modals/view-profile/view-profile.component';
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
import { BlogContentForm11Component } from './blog-content-form11/blog-content-form11.component';
import { BlogContentForm12Component } from './blog-content-form12/blog-content-form12.component';
import { BlogContentForm13Component } from './blog-content-form13/blog-content-form13.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { BlogContentForm14Component } from './blog-content-form14/blog-content-form14.component';

import { BlogContentForm15Component } from './blog-content-form15/blog-content-form15.component';
import { BlogContentForm16Component } from './blog-content-form16/blog-content-form16.component';
import { BlogContentForm17Component } from './blog-content-form17/blog-content-form17.component';
import { BlogContentForm18Component } from './blog-content-form18/blog-content-form18.component';
import { BlogContentForm19Component } from './blog-content-form19/blog-content-form19.component';
import { BlogContentForm20Component } from './blog-content-form20/blog-content-form20.component';
import { TestpageComponent } from './testpage/testpage.component';
import { PackagesComponent } from './packages/packages.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { RedirectAssessmentComponent } from './redirect-assessment/redirect-assessment.component';
import { ThankyouForApplyJobComponent } from './thankyou-for-apply-job/thankyou-for-apply-job.component';
import { RecordAudioComponent } from './record-audio/record-audio.component';
import { ApplyJobsComponent } from './apply-jobs/apply-jobs.component';
import { ThanksForJoiningComponent } from './thanks-for-joining/thanks-for-joining.component';
import { ThanksForApplyingComponent } from './thanks-for-applying/thanks-for-applying.component';
import { AlreadyJobAppliedComponent } from './already-job-applied/already-job-applied.component';
import { SocialConnectionComponent } from './social-connection/social-connection.component';
import { ApplyJobsResumeComponent } from './apply-jobs/apply-jobs-resume.component';
import { JobApplyResumeComponent } from './job-apply-resume/job-apply-resume.component';
import { VerifiedEmailContinueApplyComponent } from './verified-email-continue-apply/verified-email-continue-apply.component';

const routes: Routes = [
  { path: '', redirectTo: '/find-jobs', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'home/:id', component: HomeComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'login', component: LoginComponent },
  { path: 'linkedin-success', component: LinkedinSuccessComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'create-upload-resume', component: CreateUploadResumeComponent },
  {
    path: 'upload-resume',
    component: UploadResumeComponent,
    canActivate: [AuthGuard],
  },
  { path: 'basic-info', component: BasicInfoComponent },
  { path: 'reset/:token', component: ResetPasswordComponent },
  { path: 'reset/:token/:jobId', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:emailid', component: ProfileComponent },
  { path: 'resume-builder', component: BuilderComponent },
  { path: 'preview/:id', component: ShowProfileComponent },
  { path: 'view-profile', component: ViewProfileComponent },

  {
    path: 'resume',
    loadChildren: () =>
      import('./resume/resume.module').then((m) => m.ResumeModule),
  },
  { path: 'jobs/:emailid/:id', component: JobsComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'find-jobs', component: FindJobsComponent },
  { path: 'find-jobs/:id', component: FindJobsComponent },
  // { path: 'apply-jobs', component: ApplyJobsComponent },
  // { path: 'apply-jobs/:id', component: ApplyJobsComponent },
  { path: 'apply-jobs', component: ApplyJobsResumeComponent },
  { path: 'apply-jobs/:id', component: ApplyJobsResumeComponent },
  { path: 'job-apply', component: JobApplyResumeComponent },
  { path: 'job-apply/:id', component: JobApplyResumeComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'cookies', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'contactus/:type', component: ContactusComponent },
  { path: 'preference', component: PreferenceComponent },
  { path: 'settings', component: SettingComponent },
  { path: 'employerssubform', component: EmployerssubformComponent },
  { path: 'jobconcierge', component: JobconciergeComponent },
  { path: 'interviewprep', component: InterviewprepComponent },
  { path: 'upskill-reskill', component: UpskillReskillComponent },
  { path: 'incredibleresume', component: IncredibleresumeComponent },
  { path: 'allevents', component: AlleventsComponent },
  { path: 'returnshipprogram', component: EmployerssubformComponent },
  { path: 'talentcommunity', component: EmployerssubformComponent },
  { path: 'hiretalent', component: EmployerssubformComponent },
  {
    path: 'How-to-Make-the-Most-of-Working-with-a-Career-Coach',
    component: BlogContentForm1Component,
  },
  {
    path: 'the-role-of-subtle-repetition-on-your-resume-to-sell-your-story',
    component: BlogContentForm2Component,
  },
  {
    path: 'how-to-train-your-memory-for-a-job-interview',
    component: BlogContentForm3Component,
  },
  {
    path: '6-reasons-for-employment-gaps-and-how-to-discuss-them-in-the-interview-process',
    component: BlogContentForm4Component,
  },
  { path: 'blog', component: BlogslistComponent },
  {
    path: '8-things-to-do-before-you-write-your-resume',
    component: BlogContentForm5Component,
  },
  {
    path: 'how-to-deal-with-the-spectre-of-loneliness-in-a-job-search',
    component: BlogContentForm6Component,
  },
  {
    path: 'how-to-engage-with-your-linkedin-connections-regularly-and-how-it-helps-the-job-search',
    component: BlogContentForm7Component,
  },
  {
    path: 'should-you-create-an-interview-script-or-go-with-the-flow',
    component: BlogContentForm8Component,
  },
  {
    path: 'what-sort-of-content-should-you-share-on-social-media-as-a-job-seeker',
    component: BlogContentForm9Component,
  },
  {
    path: 'why-you-should-talk-about-your-diversity-during-your-interview',
    component: BlogContentForm10Component,
  },
  {
    path: '3-Ways-to-Make-Your-Cybersecurity-Resume-Stand-Out',
    component: BlogContentForm11Component,
  },
  {
    path: 'How-to-Build-a-Cybersecurity-Team-in-2022',
    component: BlogContentForm12Component,
  },
  {
    path: 'Breaking-into-Tech-Tips-for-Women',
    component: BlogContentForm13Component,
  },
  { path: 'unsubscribe/:emailid/:id', component: UnsubscribeComponent },
  { path: 'unsubscribe', component: UnsubscribeComponent },
  {
    path: 'The-Antidote-to-Candidate-Ghosting-Be-an-Employer-of-Choice',
    component: BlogContentForm14Component,
  },

  {
    path: 'All-Things-Considered-Preferred-Pronouns-Names-on-Resumes',
    component: BlogContentForm15Component,
  },
  {
    path: 'How-to-Be-Inclusive-During-the-Interview-Process',
    component: BlogContentForm16Component,
  },
  {
    path: 'How-to-Capture-an-Employers-Attention-This-Holiday-Season',
    component: BlogContentForm17Component,
  },
  {
    path: 'What-to-Consider-To-Find-a-Job-That-Makes-You-Happy',
    component: BlogContentForm18Component,
  },
  {
    path: '4-Reasons-to-Be-Thankful-for-The-Job-Search-This-Season',
    component: BlogContentForm19Component,
  },
  {
    path: 'How-to-Determine-If-a-Companys-Culture-Is-Right-For-You?',
    component: BlogContentForm20Component,
  },
  // { path: 'assessment', component: TestpageComponent },
  { path: 'assessments', component: AssessmentsComponent },
  { path: 'assessment', component: AssessmentComponent },
  { path: 'recorder', component: RecordAudioComponent },
  { path: 'hireselectjobs', component: PackagesComponent },
  { path: 'redirectassessment', component: RedirectAssessmentComponent },
  { path: 'thankyou-for-apply', component: ThankyouForApplyJobComponent },
  { path: 'thanks-for-joining', component: ThanksForJoiningComponent },
  { path: 'thanks-for-applying', component: ThanksForApplyingComponent },
  { path: 'already-applied', component: AlreadyJobAppliedComponent },
  { path: 'social-connect', component: SocialConnectionComponent },
  { path: 'continue-apply', component: VerifiedEmailContinueApplyComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  // , { scrollPositionRestoration: 'enabled',  onSameUrlNavigation: 'reload' }
  exports: [RouterModule],
})
export class AppRoutingModule { }
