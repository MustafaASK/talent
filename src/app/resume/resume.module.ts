import { NgModule } from '@angular/core';

// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CustomersRoutingModule } from './resume-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResumeMeterialModule } from './resume-meterial/resume-meterial.module';

import { BasicInformationComponent } from './basic-information/basic-information.component';
import { CareerSummaryComponent } from './career-summary/career-summary.component';
import { EducationComponent } from './education/education.component';
import { EmploymentHistoryComponent } from './employment-history/employment-history.component';
import { ResumeComponent } from './resume.component';
import { SkillsComponent } from './skills/skills.component';




@NgModule({
  declarations: [
    BasicInformationComponent,
    CareerSummaryComponent,
    EmploymentHistoryComponent,
    EducationComponent,
    ResumeComponent,
    SkillsComponent
  ],
  imports: [
    CustomersRoutingModule,
    FlexLayoutModule,
    ResumeMeterialModule,
    // CKEditorModule

  ]
})
export class ResumeModule { }
