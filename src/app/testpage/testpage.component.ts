import { HostListener, Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer} from '@angular/platform-browser';
import { UserAuthService } from '../user-auth.service';
import { HireRightResultComponent } from '../hire-right-result/hire-right-result.component';

@Component({
  selector: 'app-testpage',
  templateUrl: './testpage.component.html',
  styleUrls: ['./testpage.component.css']
})
export class TestpageComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private actRoute: ActivatedRoute,private router:Router, private userService: UserAuthService,private sanitizer: DomSanitizer) { }


  assessmentid:any;
  orderId:any;
  iframe:any;
  myIFrame:any;

    // iframe:any = document.getElementById('myIFrame');

    @HostListener('window:message',['$event'])
    onMessage(e:any):void
    {
      console.log(e);
      this.router.navigate(['/assessments']);
    }

  ngOnInit(): void {

    this.actRoute.queryParams
      .subscribe(params => {
        // console.log(params);  
        this.orderId = ((params && params.id) ? params.id : '');
        this.assessmentid = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:4200/redirectassessment');
      
      });
  }

  gotohome(){
    this.router.navigate(['/hireselectjobs']);
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


}
