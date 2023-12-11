import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from '../user-auth.service';
import { AssessmentCountService } from '../shared/services/assessment-count.service';

@Component({
  selector: 'app-social-connection',
  templateUrl: './social-connection.component.html',
  styleUrls: ['./social-connection.component.css']
})
export class SocialConnectionComponent implements OnInit {

  constructor(private actRoute: ActivatedRoute, private router: Router,
    private toastr: ToastrService,
    private countChange: AssessmentCountService,
    private userService: UserAuthService) {}

  connection_token: any;
  showSpinner = true;

  uid_v4 = function () {
      var g4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (g4()+g4()+"-"+g4()+"-"+g4()+"-"+g4()+"-"+g4()+g4()+g4());

    }   
    
 nonce:any = this.uid_v4();

  ngOnInit(): void {
    this.actRoute.queryParams
      .subscribe(params => {
        // console.log(params);  
        this.connection_token = ((params && params.connection_token) ? params.connection_token : '');
        // alert(this.connection_token);
          let token = this.connection_token;
          let noncetoken = this.nonce;

          // window.location.href="http://localhost:4200/login"

          // self.close();

          console.log(this.connection_token);
          // parent.postMessage(token, window.location.origin);
          // window.close();
          let data = {"connectiontoken":token};

              // window.top.postMessage("anil", "*");

          this.userService.getSocialLoginData(data).subscribe((response:any)=>{
            console.log(response);
            if(response.body.Success){ 
            //   this.userService.setToken(response.headers.get('csn-auth-token'));
            // console.log(response);
            //   var myResp = response;
              // parent.postMessage("anil", window.location.origin);


                      // localStorage.removeItem('source');
                      localStorage.removeItem('KeepmeSignedIn');
                      this.userService.setToken(response.headers.get('csn-auth-token'));
                      this.userService.setUserType(response.body.userType);        
                      this.userService.setUserId(response.body.userId);

                      
              localStorage.setItem('firstName', response.body.firstName);
              localStorage.setItem('lastName', response.body.lastName);
              localStorage.setItem('email', response.body.email);

                      // debugger;
                      localStorage.setItem("isUploadResumeStatus","0");
                        localStorage.setItem("completedAssessments",response.body.completedAssessments);
                        localStorage.setItem("totalAssessments",response.body.totalAssessments);
                        this.countChange.updateCount(response.body.completedAssessments);
                        this.countChange.updateTotal(response.body.totalAssessments);
                      this.router.navigate(['/find-jobs']);
                      if(response.body.isUploadResumeStatus == 0){
                        this.router.navigate(['/upload-resume']);
                    } else if (response.body.isUploadResumeStatus == 1){ 
                        this.router.navigate(['/create-upload-resume']);
                    } else {
                            this.router.navigate(['/dashboard']);                
                        
                    }
                      // setTimeout(() => {
                      //   window.location.reload();
                      // }, 200);
                
            }
            if(response.body.Error){  
                          this.toastr.error(response.body.Message);
                              this.router.navigate(['/login']);  
            // console.log(response);
            //   var errorObj = {
            //     'message':response.body.Message
            //   };      
            //   parent.postMessage(errorObj, window.location.origin);
            }
            // window.close();
          },(error=>{

          }));

    // this.userService.getSocialLoginData(token, noncetoken).subscribe((response)=>{
    //   console.log(response);
    //   // this.router.navigate(['items'], { relativeTo: this.route });
    // },(error=>{

    // }));


        // window_ref.addEventListener('loadstart', function(event) {  
        // if ((event.url).startsWith(callback_uri)) {

          // received_url = event.url;
          // received_url = received_url.replace(/#.*$/, '');

          // oneall_connection_token = received_url.split("connection_token=")[1];

          // $http({
          //     method: "GET",
          //     dataType: "json",
          //     aync: false,
          //     url: "https://app-1084729-1.api.oneall.com/connection/" + this.connection_token + ".json",
          //     headers: { "Authorization": "OneallNonce " + nonce }
          //   })
          //   .success(function(data) {
          //     oneall_identity = data.response.result.data.user.identity;
          //     $location.path("/welcome");
          //   })
          //   .error(function(data, status) {
          //     alert("ERROR: " + data);
          //   });

          // window_ref.close();
        // }
        // });  
        // this.assessmentid = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.ondemandassessment.com/verify/index/' + ((params && params.id) ? params.id : ''));

      });
  }

}
