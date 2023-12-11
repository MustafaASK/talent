import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UserAuthService } from 'src/app/user-auth.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { environment } from 'src/environments/environment';
import { Emitters } from '../../../class/emitters/emitters';

@Component({
  selector: 'app-show-job',
  templateUrl: './show-job.component.html',
  styleUrls: ['./show-job.component.css'],
})
export class ShowJobComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditlogService: AuditlogService,
    private userService: UserAuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.badgesPath = environment.badgesPath;
  }
  selectedJob: any;
  showSpinner = false;
  applied = false;
  assessmentsAry: any = [];
  badgesPath: any;
  isassessSectionScrolled = false;
  pageName: any;
  isAlreadyOldUser = false;
  job_url: any;

  applyJob() {
    if (this.pageName == 'find-jobs') {
      localStorage.setItem('pageFrom', 'accuick');
      localStorage.setItem('jobData', JSON.stringify(this.selectedJob));

      if (!this.userService.isUserLoggedIn()) {
        this.closeModal();
        this.router.navigate(['/apply-jobs'], {
          queryParams: { jobid: this.selectedJob.jobid },
        });
        // this.router.navigate(['/login']);
        Emitters.authEmitter.emit(false);
        return;
      } else {
        Emitters.authEmitter.emit(true);
        this.isAlreadyOldUser = true;
        // this.router.navigate(['/thanks-for-applying']); // latest
        // this.router.navigate(['/thankyou-for-apply']);// old
        // return;
      }

      // this.router.navigate(['/login']);
      // Emitters.authEmitter.emit(false);
      // return;
    } else {
      localStorage.setItem('pageFrom', 'accuick');
      this.selectedJob.job_url = this.job_url;
      localStorage.setItem('jobData', JSON.stringify(this.selectedJob));
    }

    let dataToPass = {
      accuickJobId: this.selectedJob.jobid,
      userId: Number(localStorage.getItem('userId')),
      jobTitle: this.auditlogService.encryptAES(this.selectedJob.jobtitle),
      clientName: this.auditlogService.encryptAES(this.selectedJob.compname),
      city: this.auditlogService.encryptAES(this.selectedJob.city),
      state: this.auditlogService.encryptAES(this.selectedJob.state),
      zipcode: this.auditlogService.encryptAES(this.selectedJob.zipcode),
      payRate: this.auditlogService.encryptAES(this.selectedJob.payrate),
      jobType: this.auditlogService.encryptAES(this.selectedJob.jobtype),
      description: this.auditlogService.encryptAES(
        this.selectedJob.description
      ),
      source: 'cxninja',
    };
    this.showSpinner = true;
    this.userService.applyJob(dataToPass).subscribe(
      (response: any) => {
        this.showSpinner = false;
        if (!localStorage.getItem('userToken')) {
          const pageUrl = JSON.parse(localStorage.getItem('jobData') || '{}');
          this.toastr.info(response.Message);
          this.router.navigate(
            [pageUrl && pageUrl.job_url ? pageUrl.job_url : 'apply-jobs'],
            { queryParams: { jobid: this.selectedJob.jobid } }
          );
          this.closeModal();
          return;
        }
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
          // if (!localStorage.getItem('userToken')) {
          //   this.userService.applyJobIsToken(this.selectedJob.jobid);
          //   this.closeModal();
          // }
        }

        if (response.Error) {
          this.toastr.error(response.Message);
          // if (!localStorage.getItem('userToken')) {
          //   this.userService.applyJobIsToken(this.selectedJob.jobid);
          //   this.closeModal();
          // }
        } else {
          if (response && response.Status) {
            /****already applied job */
            this.closeModal();

            if (response && response.Status && response.jobAlreadyApplied) {
              //this.toastr.success(response.Message);
              this.router.navigate(['/already-applied']);
              return;
            }

            if (this.isAlreadyOldUser) {
              localStorage.setItem('isAlreadyOldUser', 'true');
            }
            this.router.navigate(['/thanks-for-applying']);
          }
          console.log(response);
        }

        // if (response && response.Status) {
        //   this.selectedJob.applied = true;
        //   if (response.Message.includes('already')) {
        //     this.toastr.info(response.Message);
        //   } else {
        //     this.toastr.success(response.Message);
        //   }

        //   console.log(response);
        // }
      },
      (error) => {}
    );
  }
  closeModal() {
    this.dialogRef.close(this.selectedJob.applied);
  }

  ngOnInit(): void {
    this.selectedJob = this.data.selectedJob;
    this.job_url = this.data.job_url;
    this.pageName = this.data.pageName;
    this.assessmentsAry = this.selectedJob.requiredAssessments
      ? this.selectedJob.requiredAssessments
      : [];
  }
}
