import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UserAuthService } from 'src/app/user-auth.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { environment } from 'src/environments/environment';
import { Emitters } from '../../../class/emitters/emitters';

@Component({
  selector: 'app-show-apply-job',
  templateUrl: './show-apply-job.component.html',
  styleUrls: ['./show-apply-job.component.css']
})
export class ShowApplyJobComponent implements OnInit {

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
  assessmentsAry:any= [];
  badgesPath:any;
  isassessSectionScrolled=false;
  pageName:any;

  applyJob() {
    if(this.pageName == 'apply-jobs'){
      
      localStorage.setItem("pageFrom", 'accuick');
      localStorage.setItem("jobData", JSON.stringify(this.selectedJob));
      this.closeModal();
      this.router.navigate(['/login']);
      Emitters.authEmitter.emit(false);
      return;

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
      description: this.auditlogService.encryptAES(this.selectedJob.description),
      source: 'cxninja'
    }
    this.showSpinner = true;
    this.userService.applyJob(dataToPass).
      subscribe((response: any) => {
        this.showSpinner = false;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Status) {
          this.selectedJob.applied = true;
          if (response.Message.includes('already')) {
            this.toastr.info(response.Message);
          } else {
            this.toastr.success(response.Message);
          }

          console.log(response);
        }

      }, (error => {

      }));
  }
  closeModal() {
    this.dialogRef.close(this.selectedJob.applied);
  }

  ngOnInit(): void {
    this.selectedJob = this.data.selectedJob;
    this.pageName = this.data.pageName;
    this.assessmentsAry = this.selectedJob.requiredAssessments ? this.selectedJob.requiredAssessments :[];
  }

}
