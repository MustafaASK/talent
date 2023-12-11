import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.css']
})
export class SkillsFormComponent implements OnInit {


  // MasterSkills = [
  //   { lookupId : 10004001, lookupValue : "Beginer"},
  //   { lookupId : 10004002, lookupValue : "Intermediate"},
  //   { lookupId : 10004003, lookupValue : "Experienced"},
  //   { lookupId : 10004004, lookupValue : "Expert"}
  // ];




  // Editor = ClassicEditorBuild;
  color = "accent";
  resumeBuilderFrom: any;
  SkillsTypeList: any = [];

  //dateMinArrival = new Date();
  dateMinEndDate: any;
  startDateEmp = new Date();
  endDateEmp = new Date();
  skillFormObj: any;
  showSpinner = false;
  radioClicked = false;

  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  @Input() categoryList: any;
  @Input() SkillsEditIndex: any;
  @Input() editedSkillsRecordData: any;
  @Output() addSkill = new EventEmitter<any>();
  @Output() editSkill = new EventEmitter<any>();
  @Output() closeSkillForm = new EventEmitter<any>();

  constructor(private auditlogService: AuditlogService, private fb: FormBuilder,
    private userService: UserAuthService,
    private toastr: ToastrService) { }


  ngOnInit(): void {

    // cur emp status obj
    let curEmpStatusobj = this.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10004;
    });
    this.SkillsTypeList = (curEmpStatusobj && curEmpStatusobj.length) ? curEmpStatusobj[0].lookupsList : [];
    this.SkillsTypeList.forEach((ele: any) => {
      ele.checked = false;
    });

    if (this.editedSkillsRecordData) {
      this.SkillsTypeList.forEach((ele: any) => {
        ele.checked = (ele.lookupId == this.editedSkillsRecordData.skillLevelID) ? true : false;
      });

      this.skillFormObj = this.fb.group({
        skillName: this.editedSkillsRecordData.skillName,
        skillLevelID: this.editedSkillsRecordData.skillLevelID


      });
    } else {
      this.skillFormObj = this.fb.group({
        skillName: ['',Validators.required],
        skillLevelID: ['',Validators.required]

      });
    }
  }
  onradioCliked() {
    this.radioClicked = true;
    if (this.skillFormObj.controls.skillName.touched) {
      this.onBlurMethod();
    }
  }

  onBlurMethod() {
    console.log(this.skillFormObj.value);
    let touched = true;
    if (this.skillFormObj.status !== "VALID") {
      return;//"error";
    }

    // let aryData = (Object.keys(this.skillFormObj.controls));
    // for (let i = 0; i < aryData.length; i++) {
    //   if (!this.skillFormObj.controls[(aryData[i])].touched) {
    //     touched = false;
    //     break;
    //   }
    // }

    if (this.skillFormObj.valid) {
      console.log("touched all boxes>>>>");
      console.log(this.skillFormObj.value)
      let todo = {
        "userId": localStorage.getItem('userId'),
        "skillName": this.skillFormObj.value.skillName,
        "skillLevelID": this.skillFormObj.value.skillLevelID,
        "userSkillID": 0,
        "skillID": 0,
        "isManual": 0

      }

      if (this.editedSkillsRecordData) {
        todo.userSkillID = this.editedSkillsRecordData.userSkillID;
      }

      this.showSpinner = true;

      this.userService.saveoreditskilldetails(todo).subscribe(
        (response) => {
          // this.listTodos();
          console.log(response);
          this.showSpinner = false;

          let todo = {
            "userId": localStorage.getItem('userId'),
            "skillName": this.skillFormObj.value.skillName,
            "skillLevelID": this.skillFormObj.value.skillLevelID,
            "userSkillID": response.userSkillID,
            "skillID": response.skillID,
            "isManual": false

          }

          if (this.editedSkillsRecordData) {
            this.editSkill.emit(todo);
          } else {
            this.addSkill.emit(todo);
          }

        }, (error => {

        }));
    }
  } //onblurMethod()



  closeInnerForm() {
    let type: string;
    if (this.editedSkillsRecordData) {
      this.staticAuditLogAPI('36', '');
      type = 'edit';
    } else {
      this.staticAuditLogAPI('33', '');
      type = 'add';
    }
    this.closeSkillForm.emit(type);
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


