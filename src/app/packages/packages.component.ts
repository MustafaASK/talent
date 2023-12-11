import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../user-auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HirerightformComponent } from '../hirerightform/hirerightform.component';


export interface PeriodicElement {
  id: string;
  name: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {


  displayedColumns: string[] = ['demo-id', 'demo-name','demo-action'];
  dataSource:any;
  dataToPass:any;
  showSpinner:boolean = false;
  orderId:any;
  constructor(public dialog: MatDialog,
    private router: Router,
    private userService: UserAuthService) { }

  ngOnInit(): void {
    this.orderId = this.randomString(10);
    this.getPackages();
  }
  getPackages(){

    
    // this.showSpinner = true;
      this.userService.getPackages().subscribe((response) => {
        // this.showSpinner = false;
        console.log(response);

        this.dataSource = response;

        for(let i=0; i<this.dataSource.length; i++){
          this.dataSource[i].push('send');
        }
        // if(response && response.Success){
        //   this.router.navigate(['/unsubscribe'], { queryParams: {'email':this.email, 'status':'unsubscribe-success' } });
        
        // }
        
        
  
      }, (error => {
  
      }));
  }

  randomString(length:any) {
      var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var result = '';
      for ( var i = 0; i < length; i++ ) {
          result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      return result;
  }

  openInviteForm(obj:any): void{
    console.log(obj)
    // return;
    localStorage.setItem('orderId',this.orderId);
    this.dataToPass = { 
                          "packageId": {"value": obj.id}, 
                           "orderId": {"value": this.orderId},
                          "candidate": { 
                            "first": 'Shaik', 
                            "last": 'Subhani', 
                            "email": 'akunde@ova.work' 
                          }, 
                          "sendCandidateEmail": true
                        } 

      this.showSpinner = true;
      this.userService.orderHireSelect(this.dataToPass).subscribe((response) => {
        console.log(response);
        this.showSpinner = false;
        if (response && response.assessmentAccessURL) {
          let ary = (response.assessmentAccessURL.uri.split('/'));

          // this.dialogRef.close((ary[ary.length -1]));
          this.router.navigate(['/assessment'], { queryParams: { 'id':(ary[ary.length -1]) } });

        }
      }, (error => {

      }));
    // const dialogRef = this.dialog.open(HirerightformComponent, {
    //   height: 'calc(100% - 160px)',
    //   data: { candPage: '2' },
    // });


    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // this.router.navigate(['/assessment'], { queryParams: {'id':'this.email' } });
    //     }
    //   console.log(result);
    // });
  }

}
