import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Emitters } from 'src/app/class/emitters/emitters';
import { UserAuthService } from 'src/app/user-auth.service';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UpdatePasswordComponent } from '../modals/update-password/update-password.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements OnInit {

  isMobile = false;
  isHome: any;
  hideMenuInMobile = false
  isLoginMenuCollapsed = true;
  isLogin: any;
  thanksForPage: any;
  authenticated = false;
  toggleDashboard: boolean = false;
  isCollapsed = true;
  firstName = '';
  lastName = '';
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  userTypeToken = false;

  @Input() showLeftMenuForThanksApply: any;
  @Input() showLeftMenuForJoining: any;
  @Input() currentUrl: any;

  constructor(public dialog: MatDialog, private userService: UserAuthService, private router: Router, private auditlogService: AuditlogService) { }

  ngOnInit(): void {

    this.isMobile = window.innerWidth < 615 ? true : false;


    this.router.events.subscribe((event) => {
      this.isLoginMenuCollapsed = true;


      //console.log(this.isHome)
    });

    this.hideMenuInMobile = window.innerWidth < 615 ? true : false;


    this.firstName = (localStorage.getItem('firstName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('firstName') || '{}')) : '';
    this.lastName = (localStorage.getItem('lastName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('lastName') || '{}')) : '';
    // this.email = (localStorage.getItem('email') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('email') || '{}')) : '';

    Emitters.authEmitter.subscribe(
      (auth: boolean) => {
        // debugger
        this.authenticated = auth;
      }

    );

    this.thanksForPage = (this.currentUrl.indexOf('/thanks-for-applying') !== -1) ? true : false;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
        this.isHome = this.router.url == '/home' ? true : false;
        this.isLogin = this.router.url == '/login' ? true : false;
        if (this.userService.getUserType() == 'true') {
          this.userTypeToken = true;
        } else {
          this.userTypeToken = false;

        }
        //console.log(this.isHome)
      }
    });
  }

  openUpdatePassword(type: any): void {
    const dialogRef = this.dialog.open(UpdatePasswordComponent, {
      // height: '55%',
      // height: this.isMobile ? '100%' : '',
      // width: this.isMobile ? '100%' : '95%',
      width: "35%"
      // hasBackdrop: false,
    });


  }


  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
    Emitters.authEmitter.emit(false);
    this.authenticated = false;
    this.staticAuditLogAPI('134', '');
  }

  menuToggle() {

    this.toggleDashboard = !this.toggleDashboard;
    this.authenticated = false;
  }

  gotohome() {
    this.staticAuditLogAPI('132', '');
    this.router.navigate(['/find-jobs']);
  }

  staticAuditLogAPI(actionId: string, jsonString: string) {
    let num: any = (localStorage.getItem("userId")) ? (localStorage.getItem("userId")) : ''; //number
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
        if (response.Success) {

        }

      },
      (error) => { }
    )

  }

}
