import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UserAuthService } from 'src/app/user-auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  // verifycodeForm:FormGroup;
  // checkboxForm: FormGroup;
  jobForm: FormGroup;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  jobtypes = [
    {"name":"Full Time", "value":"Full-time","selected":false}, 
    {"name":"Part Time", "value":"Part-time","selected":false},
    {"name":"Contract", "value":"Contract","selected":false},
    {"name":"Internship", "value":"Internship","selected":false},
    {"name":"Temporary", "value":"Temporary","selected":false}
  ];

  value:string= '';
  textCopied = false;
  constructor(
    private formBuilder: FormBuilder,
    // private filtersModule: filtersModule,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FiltersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditlogService: AuditlogService,
    private userService: UserAuthService,
    private toastr: ToastrService
    ) {
      console.log(data.filterObj.jobType != "All Job Types");
      this.jobForm = this.formBuilder.group({
        fulltime: data.filterObj.jobType.indexOf("Full-time") != -1 ? true : false,
        parttime: data.filterObj.jobType.indexOf("Part-time") != -1 ? true : false,
        contract: data.filterObj.jobType.indexOf("Contract") != -1 ? true : false,
        internship:data.filterObj.jobType.indexOf("Internship") != -1 ? true : false,
        temporary:data.filterObj.jobType.indexOf("Temporary") != -1 ? true : false,
        dateposted: data.filterObj.dateposted != "0" ? data.filterObj.dateposted : "",
        distance: data.filterObj.distance != "0" ? data.filterObj.distance : "",
        isRemote:data.filterObj.isRemote
      });
      
    // this.loginForm = this.formBuild.group({
    //   firstName: new FormControl('', [Validators.required]),
    //   lastName: new FormControl('', [Validators.required]),
    //   email: new FormControl(this.emailId, [
    //     Validators.required,
    //     Validators.pattern(
    //       /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    //     ),
    //   ]),
    //   phoneNo: new FormControl('', [Validators.required]),
    //   file: new FormControl('', [Validators.required]),
    //   userType: new FormControl(true),
    // });



      // this.jobForm = formBuilder.group({
      //   // candname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      //   // status: ['', Validators.required],
      //   keyWords: [''],
      //   location: [''],
      //   jobType: [''],
      //   hours: [''],
      //   payRate: [''],
      // });
    
    // this.verifycodeForm  = formBuilder.group({
    //   // email : new FormControl({value:this.emailId,disabled:true},[Validators.required,Validators.email]),
    //   // email: ['', Validators.required,Validators.email],
    //    confirmOtp : new FormControl('https://app.csninja.com/csninja/login')
    //  });
     }

     

    copyText():void{
      this.staticAuditLogAPI('151', JSON.stringify(this.value));
      this.textCopied = true;
    }
    onSubmit():void{
      let finalJobTitle = '';
      console.log(this.jobForm.value);
      if(this.jobForm.value[Object.keys(this.jobForm.value)[0]]){
        finalJobTitle = 'Full-time'
      }
      if(this.jobForm.value[Object.keys(this.jobForm.value)[1]]){
        finalJobTitle = (finalJobTitle ?   finalJobTitle + ',' + 'Part-time' : 'Part-time') 
      }
      if(this.jobForm.value[Object.keys(this.jobForm.value)[2]]){
        finalJobTitle = (finalJobTitle ?   finalJobTitle + ',' + 'Contract' : 'Contract')
      }
      if(this.jobForm.value[Object.keys(this.jobForm.value)[3]]){
        finalJobTitle = (finalJobTitle ?   finalJobTitle + ',' + 'Internship' : 'Internship')
      }
      if(this.jobForm.value[Object.keys(this.jobForm.value)[4]]){
        finalJobTitle = (finalJobTitle ?   finalJobTitle + ',' + 'Temporary' : 'Temporary')
      }      
      // console.log(finalJobTitle);
      this.dialogRef.close({
          "jobTitle":finalJobTitle,
          "dateposted":this.jobForm.value.dateposted,
          "distance":this.jobForm.value.distance,
          "isRemote": this.jobForm.value.isRemote,
      });
    }

    

   
  ngOnInit(): void {
    console.log(this.data);
    // this.value = environment.FrontEndURLForUser + 'preview/' + this.data.candData.profileId;
    this.staticAuditLogAPI('149', '');

  }

  onClose(): void {
    this.dialogRef.close();
    this.staticAuditLogAPI('150', '');

  }

  staticAuditLogAPI(actionId: string, jsonString: string) {
    let num: any = (localStorage.getItem("userId")); //number
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
