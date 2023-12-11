import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Emitters } from 'src/app/class/emitters/emitters';
import { UserAuthService } from 'src/app/user-auth.service';
import { environment } from 'src/environments/environment';
import { AssessmentCountService } from './shared/services/assessment-count.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'website1';
  year = new Date().getFullYear();
  isHome: any;
  dashboardReached = false;
  authenticated: any;
  profilePreview = false;
  viewprofile = false;
  assessmentPreview = false;
  footerDisplay = false;
  findJobs = false;
  userToken: any;
  showLeftMenuForThanksApply = true;
  showLeftMenuForJoining = false;
  currentUrl: any;

  constructor(
    private router: Router,
    private userService: UserAuthService,
    private countChange: AssessmentCountService
  ) {
    if (environment.googleAnalyticsKey) {
      // register google tag manager
      const gTagManagerScript = document.createElement('script');
      gTagManagerScript.async = true;
      gTagManagerScript.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsKey}`;
      document.head.appendChild(gTagManagerScript);

      // register google analytics
      const gaScript = document.createElement('script');
      gaScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
      `;
      // gtag('config', '${environment.googleAnalyticsKey}');
      document.head.appendChild(gaScript);
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;

        this.isHome = this.router.url == '/home' ? true : false;
        this.userToken = this.userService.getUserType();
        this.dashboardReached =
          this.router.url == '/dashboard' ||
            this.router.url == '/settings' ||
            this.router.url.indexOf('/profile') !== -1 ||
            this.router.url.indexOf('/view-profile') !== -1 ||
            this.router.url.indexOf('/jobs') !== -1 ||
            this.router.url == '/preference' ||
            this.router.url.indexOf('/thanks-for-applying') !== -1 ||
            this.router.url.indexOf('/thanks-for-joining') !== -1 ||
            this.router.url.indexOf('/already-applied') !== -1 ||
            this.router.url.indexOf('/thankyou-for-apply') !== -1 ||
            this.router.url.indexOf('/continue-apply') !== -1 ||
            this.router.url.indexOf('/assessments') !== -1
            ? true
            : false;

        if (
          this.router.url.indexOf('/thanks-for-applying') !== -1
           ||
          this.router.url.indexOf('/already-applied') !== -1
        ) {
          if (this.userToken == 'true') {
            this.showLeftMenuForThanksApply = true;
          } else {
            this.showLeftMenuForThanksApply = false;
          }
        } else {
          if (
            this.router.url.indexOf('/login') !== -1 ||
            this.router.url.indexOf('/reset') !== -1 ||
            this.router.url.indexOf('/signup') !== -1 ||
            this.router.url.indexOf('/forgot') !== -1
          ) {
            localStorage.removeItem('isAlreadyOldUser');
          }
          this.showLeftMenuForThanksApply = true;
        }
        if (this.router.url.indexOf('/thanks-for-joining') !== -1) {
          this.showLeftMenuForJoining = true;
        }
        this.footerDisplay =
          this.router.url.indexOf('/login') !== -1 ||
            this.router.url.indexOf('/forgot-password') !== -1 ||
            this.router.url.indexOf('/signup') !== -1 ||
            this.router.url.indexOf('/reset') !== -1
            ? true
            : false;
        //console.log(this.isHome)
        this.profilePreview = this.router.url.indexOf('/preview') !== -1;
        this.viewprofile = this.router.url.indexOf('/view-profile') !== -1;
        this.assessmentPreview =
          (this.router.url.indexOf('/assessment') !== -1 &&
            this.router.url.split('?')[0].length == 11) || (this.router.url.indexOf('/redirectassessment') !== -1);
        this.findJobs = this.router.url.indexOf('/find-jobs') !== -1;
        console.log(this.router.url);
        let x: HTMLElement | null = document.getElementById('iFrameDiv');
        if (this.findJobs) {
          // console.log(x)
          // if(window.location.pathname.indexOf('find-jobs') != '-1'){
          x ? x.style.display = 'block' : '';
          // if (event.data == true) {
          //     x.style.height = '80vh';
          // } 

          // } else {
          //     x.style.display = 'none';
          // }

        } else {
          x ? x.style.display = 'none' : '';

        }
        // gtag('set', 'page', this.router.url);
        // gtag('send', 'pageview');
        // gtag('send', 'pageview', {
        //   'page': 'anil',
        //   'title': 'anil'
        // });
        // Dev : G-F5B7WQR6RD
        // Prod : G-VYXFFHNN9S

        if (environment.googleAnalyticsKey) {
          console.log(environment.googleAnalyticsKey);
          gtag('config', environment.googleAnalyticsKey, {
            page_title: this.router.url,
            page_path: this.router.url,
          });
        }
      }
    });
  }
  onActivate(e: any, outlet: any) {
    // setTimeout(() => {
    // outlet.scrollTop = 0;
    // window.scroll(0,0);
    // }, 0);
  }

  ngOnInit(): void {
    // this.getcategorylist();
    if (localStorage.getItem('completedAssessments')) {
      this.countChange.updateCount(
        Number(localStorage.getItem('completedAssessments'))
      );
      this.countChange.updateCount(
        Number(localStorage.getItem('totalAssessments'))
      );
    }
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });

  }

  getNotification(event: Event) {
    alert(123);
  }
}
