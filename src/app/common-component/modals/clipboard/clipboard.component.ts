import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UserAuthService } from 'src/app/user-auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.css']
})
export class ClipboardComponent implements OnInit {

  // verifycodeForm:FormGroup;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  value:string= '';
  textCopied = false;
  constructor(
    private formBuilder: FormBuilder,
    // private clipboardModule: ClipboardModule,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ClipboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditlogService: AuditlogService,
    private userService: UserAuthService,
    private toastr: ToastrService
    ) {
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


    

   
  ngOnInit(): void {
    console.log(this.data);
    this.value = environment.FrontEndURLForUser + 'preview/' + this.data.candData.profileId;
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
