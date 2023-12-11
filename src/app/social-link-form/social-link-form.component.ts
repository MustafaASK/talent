import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup,FormControl, Validators,FormArray } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-social-link-form',
  templateUrl: './social-link-form.component.html',
  styleUrls: ['./social-link-form.component.css']
})
export class SocialLinkFormComponent implements OnInit {

  MasterSocialLinks:any;
  // MasterSocialLinks = [
  //   { lookupId : 10007001, lookupValue : "LinkedIn"},
  //   { lookupId : 10007002, lookupValue : "Facebook"},
  //   { lookupId : 10007003, lookupValue : "GitHub"},

  // ];

  // Editor = ClassicEditorBuild;
  color = "accent";
  resumeBuilderFrom:any;
  showSpinner = false;

  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  //dateMinArrival = new Date();
  dateMinEndDate : any;
  startDateEmp = new Date();
  endDateEmp = new Date();
  socailLinkFormObj:any;

  @Input() categoryList:any; 
  @Input() socialLinkEditIndex:any;  
  @Input() editedSLRecordData:any;
  @Output() addSocialLink = new EventEmitter<any>();
  @Output() editSocialLink = new EventEmitter<any>();
  @Output() closeSLForm = new EventEmitter<any>();

  constructor(private auditlogService:AuditlogService,private fb:FormBuilder,    
    private userService: UserAuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

     // cur emp status obj
     let curEmpStatusobj = this.categoryList.filter(function(obj:any){
      return obj.categoryID == 10007;
    });
    this.MasterSocialLinks = (curEmpStatusobj && curEmpStatusobj.length) ? curEmpStatusobj[0].lookupsList : [];


    if(this.editedSLRecordData) {
      this.socailLinkFormObj = this.fb.group({
         socialTypeLookupID: this.editedSLRecordData.socialTypeLookupID,
         socialURL: this.editedSLRecordData.socialURL,
       });
    }else{
      this.socailLinkFormObj = this.fb.group({
        socialTypeLookupID: [''],
        socialURL: ['']
       });
    }
   
  }

  onBlurMethod(){
    console.log(this.socailLinkFormObj.value); 
    let touched = true;
    if(this.socailLinkFormObj.status !== "VALID"){
      return;//"error";
    }
    
    // let aryData = (Object.keys(this.socailLinkFormObj.controls));
    // for(let i=0 ; i< aryData.length; i++){
    //   if(!this.socailLinkFormObj.controls[(aryData[i])].touched){
    //     touched = false;
    //     break;
    //   }
    // }

    if(this.socailLinkFormObj.valid){
      console.log("touched all boxes>>>>");
      console.log(this.socailLinkFormObj.value)
      let todo = {
        "userId" : localStorage.getItem('userId'),
        "userSocialID": 0,
        "socialURL" : this.socailLinkFormObj.value.socialURL,
        "socialTypeLookupID": this.socailLinkFormObj.value.socialTypeLookupID,
        "isManual" : 0 
      }

      if(this.editedSLRecordData){
        todo.userSocialID = this.editedSLRecordData.userSocialID;
      }
      this.showSpinner = true;

       this.userService.saveoreditsociallinksdetails(todo).subscribe(
        (response)=>{
            // this.listTodos();
            //console.log(response);
            this.showSpinner = false;
            let todoObj = {
              "userId" : localStorage.getItem('userId'),
              "userSocialID": response.userSocialID,
              "socialURL" : this.socailLinkFormObj.value.socialURL,
              "socialTypeLookupID": this.socailLinkFormObj.value.socialTypeLookupID,
              "isManual" : false 
            }
            console.log(todo);

            if(this.editedSLRecordData){
              this.editSocialLink.emit(todoObj);
            } else {
              this.addSocialLink.emit(todoObj);
            }
           

           
          },(error=>{

        }));
    }

  }

  closeInnerForm(){
    let type:string;
    if(this.editedSLRecordData){
      this.staticAuditLogAPI('57', '');
      type = 'edit';
    } else {
      this.staticAuditLogAPI('54', '');
      type = 'add';
    }
    this.closeSLForm.emit(type);
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
