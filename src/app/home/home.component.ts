import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HostListener } from "@angular/core";
import { Router,ActivatedRoute  } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from '../class/emitters/emitters';
import { UserAuthService } from '../user-auth.service';
import { ConfirmDialogModel, DeleteConfirmDialogComponent } from '../common-component/modals/delete-confirm-dialog/delete-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  deviceInfo:any = null;
  isboxclose= true;
  cookiesEnable: any;
  x:any;
  scrHeight:any;
  scrWidth:any;

   @ViewChild('makeSlider') makeSlider:any;
    
   @HostListener('window:resize', ['$event'])
   getScreenSize() {
         this.scrHeight = window.innerHeight;
         this.scrWidth = window.innerWidth;
         console.log(this.scrHeight, this.scrWidth);
   }

    constructor(private deviceService: DeviceDetectorService, 
      private userService: UserAuthService,private router:Router,
      public dialog: MatDialog,
      private actRoute: ActivatedRoute,
      private toastr: ToastrService) {
      this.epicFunction();
      this.getScreenSize();
    }
    
    epicFunction() {
      console.log('hello `Home` component');
      this.deviceInfo = this.deviceService.getDeviceInfo();
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      const isDesktopDevice = this.deviceService.isDesktop();
      console.log(this.deviceInfo);
      console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
      console.log(isTablet);  // returns if the device us a tablet (iPad etc)
      console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
    }

  ngOnInit(): void {

    if(localStorage.getItem('cookiesEnable')){
      this.cookiesEnable = false;
    }else{
      this.cookiesEnable = true;
    }

    
    if(!this.userService.isUserLoggedIn()){
      
      this.router.navigate(['/home']);
      Emitters.authEmitter.emit(false);
    }else{
     
      Emitters.authEmitter.emit(true);
     
    }
    
  }

   ngAfterViewInit() {
    console.log('alert (afterviewinit)', this.makeSlider.nativeElement);
    
    // this.router.navigate([ url ], { queryParams: { ... } })
    // this.router.navigate(['/unsubscribe']);
    // this.router.navigate(['/unsubscribe','anil@gmail.com',123], { queryParams: { 'status':'subscribe-success' } });

    // this.makeSlider.nativeElement.querySelectorAll('.myClass').forEach(
    //   makeSlider:any => {
    //     makeSlider.classList.remove('myClass');
    //     makeSlider.classList.add('newClass');
    //   }
    // )
    const elements = this.makeSlider.nativeElement.children;
    console.log(elements);
    // elements.forEach(e:any => {
    //   console.log(e);
    // //  if(element.checked){
    // //     element.checked = false
    // //  }
    // });
    let len = 0;
    let val = (this.scrWidth <= 900) ? 110 : 150;
    this.x = setInterval(() => { 
      // elements[len].classList.remove('newClass');
      val = val - ((this.scrWidth <= 900) ? 40.1 : 50);
      if(elements[len-1]){
        elements[len-1].classList.remove('active');
        elements[len-1].classList.add('inactive');
        elements[len-1].classList.add('inactivetop');
        // elements[len-1].classList.add('inactivebottom');
        elements[len-1].classList.remove('ininactive');
        elements[len-1].classList.remove('ininactivetop');
        elements[len-1].classList.remove('ininactivebottom');
        elements[0].style.marginTop = (val)+'px';
      }
      if(elements[len-2]){
        elements[len-2].classList.remove('active');
        elements[len-2].classList.remove('inactive');
        elements[len-2].classList.remove('inactivetop');
        elements[len-2].classList.remove('inactivebottom');
        elements[len-2].classList.add('ininactive');
        elements[len-2].classList.add('ininactivetop');
        // elements[len-2].classList.add('ininactivebottom');
      }
      if(elements[len]){
        elements[len].classList.remove('inactive');
        elements[len].classList.remove('inactivetop');
        elements[len].classList.remove('inactivebottom');
        elements[len].classList.remove('ininactive');
        elements[len].classList.remove('ininactivetop');
        elements[len].classList.remove('ininactivebottom');
        elements[len].classList.add('active');

      }
      if(elements[len+1]){
        elements[len+1].classList.remove('active');
        elements[len+1].classList.remove('ininactive');
        elements[len+1].classList.remove('ininactivetop');
        elements[len+1].classList.remove('ininactivebottom');
        elements[len+1].classList.add('inactive');
        // elements[len+1].classList.add('inactivetop');
        elements[len+1].classList.add('inactivebottom');
      }
      if(elements[len+2]){
        elements[len+2].classList.remove('active');
        elements[len+2].classList.remove('inactive');
        elements[len+2].classList.remove('inactivetop');
        elements[len+2].classList.remove('inactivebottom');
        elements[len+2].classList.add('ininactive');
        // elements[len+2].classList.add('ininactivetop');
        elements[len+2].classList.add('ininactivebottom');
      }
      if(elements[len-4]){
        elements[len-4].classList.remove('active');
        elements[len-4].classList.remove('inactive');
        elements[len-4].classList.remove('inactivetop');
        elements[len-4].classList.remove('inactivebottom');
        elements[len-4].classList.remove('ininactive');
        elements[len-4].classList.remove('ininactivetop');
        elements[len-4].classList.remove('ininactivebottom');

      }
      if(elements.length -2 == len+1){ //elements.length -2
        clearInterval(this.x);

      }
      // console.log(len);
      len++;
    }, 500);
    // elements.forEach((element:any,index:any) => {
    //   console.log(element);
      
    // });
    
    if(this.actRoute.snapshot.params.id){
      const message = `Are you sure you want to unsubscribe newsletters?`;
      const dialogData = new ConfirmDialogModel("Confirm Action", message);
      const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
        maxWidth: "800px",
       // height: 'calc(100% - 160px)',
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
          
        console.log(dialogResult);
        if(dialogResult){
          let dataToPass = {
            "userId": localStorage.getItem('userId'),
            "unSubscribe": 1
          }
            this.userService.unsubscribe(dataToPass).subscribe((response) => {
              console.log(response);
              if(response && response.Success){
              
                this.router.navigate(['/home']);
              }
              
              
  
            }, (error => {
  
            }));
  
        } else {
          this.router.navigate(['/home']);
        }
      }); //
    }

  }
  
  onclose(){
    this.isboxclose= false;
  }
  knowmore(){
    // this.router.navigate(['/privacy']);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/cookies'])
    );
    window.open(url, '_blank');

  }
  cookiesAlert():any{
    localStorage.setItem('cookiesEnable', "false")
    this.cookiesEnable= false;
  }
}
