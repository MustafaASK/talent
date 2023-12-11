import { HostListener, Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer} from '@angular/platform-browser';
import { UserAuthService } from '../user-auth.service';
import { HireRightResultComponent } from '../hire-right-result/hire-right-result.component';
import { AuditlogService } from '../shared/auditlog.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private actRoute: ActivatedRoute,private router:Router, private userService: UserAuthService,
    private auditlogService: AuditlogService,private sanitizer: DomSanitizer) { }


  assessmentid:any;
  orderId:any;
  iframe:any;
  myIFrame:any;
  isRedirectAssessmentPage = true;

  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

    // iframe:any = document.getElementById('myIFrame');

    @HostListener('window:message',['$event'])
    onMessage(e:any):void
    {
      console.log(e);
      // this.router.navigate(['/dashboard']);
    }

  ngOnInit(): void {

    this.actRoute.queryParams
      .subscribe(params => {
        // console.log(params);  
        this.orderId = ((params && params.id) ? params.id : '');        
        this.assessmentid = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.ondemandassessment.com/verify/index/' + ((params && params.id) ? params.id : ''));
      
      });
     this.isRedirectAssessmentPage = this.router.url == '/redirectassessment' ? true : false; 
  }

  gotohome(){
    this.staticAuditLogAPI('148', '');
    this.router.navigate(['/dashboard']);
    //this.router.navigate(['/hireselectjobs']);
  }
  seeResults(): void{
      const dialogRef = this.dialog.open(HireRightResultComponent, {
      height: 'calc(100% - 100px)',
      width: 'calc(100% - 500px)',
      data: { candOrderId: localStorage.getItem('orderId') },
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.router.navigate(['/assessment'], { queryParams: {'id':'this.email' } });
        }
      console.log(result);
    });
  }


  staticAuditLogAPI(actionId: string, jsonString: string) {
    let num:any = (localStorage.getItem("userId")); //number
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

