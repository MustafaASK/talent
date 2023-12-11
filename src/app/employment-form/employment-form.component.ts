import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup,FormControl, Validators,FormArray } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import {MatCalendarCellClassFunction, MatDatepicker} from '@angular/material/datepicker';
//import * as moment from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


import * as _moment from 'moment';
import { RemoveJunkTextService } from '../shared/services/remove-junk-text.service';
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-employment-form',
  templateUrl: './employment-form.component.html',
  styleUrls: ['./employment-form.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EmploymentFormComponent implements OnInit {

  
  // Editor = ClassicEditorBuild;
  color = "accent";
  resumeBuilderFrom:any;

  //dateMinArrival = new Date();
  dateMinEndDate : any;
  startDateEmp = new Date();
  endDateEmp = new Date();
  empFormObj:any;
  showSpinner = false;

  currentCompanyCtrl: any;
  endDateCtrl:any;
  isCurrentEmp:any;
  isEditable:any;
  currentDate:any;

  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  
  @Input() editedEmpRecordData:any;  
  @Input() employmentEditIndex:any;  
  @Output() addEmployment = new EventEmitter<any>();
  @Output() editEmployment = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>();

  constructor(private auditlogService:AuditlogService,private fb:FormBuilder,    
    private userService: UserAuthService,
    private toastr: ToastrService,
    public removeJunk: RemoveJunkTextService
    ) {}

    closeInnerForm(){
      let type:string;
      if(this.editedEmpRecordData){
        this.staticAuditLogAPI('22', '');
        type = 'edit';
      } else {
        this.staticAuditLogAPI('19', '');
        type = 'add';
      }
      this.closeForm.emit(type);
    }

  onBlurMethod(){
    // alert(123);
    console.log(this.empFormObj);
    let touched = true;
    if(this.empFormObj.status !== "VALID"){
      
      // this.toastr.error(response.Message);
      return;//"error";
    }
    // let aryData = (Object.keys(this.empFormObj.controls));
    // for(let i=0 ; i< aryData.length; i++){
    //   if(!this.empFormObj.controls[(aryData[i])].touched){
    //     touched = false;
    //     break;
    //   }
    // }
   
    if(this.empFormObj.valid){
      
      console.log("touched all boxes");
    //   let todo1 = {
    //     "email" : this.auditlogService.encryptAES(this.empFormObj.value.email),
    //     "password":this.auditlogService.encryptAES(this.empFormObj.value.password),
    //      "sourceLookupId" : 10002002,
    //      "communityId" : 1000,
    //      "status" : 1   
    // }
    let todo = {
      "userId" : localStorage.getItem('userId'),
      "companyName" : this.auditlogService.encryptAES(this.empFormObj.value.employer),
      "workAddress" : this.auditlogService.encryptAES(this.empFormObj.value.city),
      "jobTitle" : this.auditlogService.encryptAES(this.empFormObj.value.jobtitle),
      "startDate" :  (moment(this.empFormObj.value.startDate).format('YYYY-MM-DD')),
      "endDate": this.isCurrentEmp ? (moment(new Date()).format('YYYY-MM-DD')):(moment(this.empFormObj.value.endDate).format('YYYY-MM-DD')),
      "empResponsibilities" : this.auditlogService.encryptAES(this.empFormObj.value.emp_summary),
      "currentCompany" : this.empFormObj.value.currentCompany,
      "isManual" : 0,
      "modifiedDateTime" :moment(moment().format("YYYY-MM-DD")),
      "userEmploymentId":0
    }
    if(this.editedEmpRecordData){
      todo.userEmploymentId = this.editedEmpRecordData.userEmploymentID;
    }
    this.showSpinner = true;
    
      // console.log(this.loginForm.value);
      this.userService.saveoreditemploymentdetails(todo).subscribe((response)=>{
        // this.listTodos();
        console.log(response);
        //debugger;
        let eventEndTime = this.isCurrentEmp ? (moment(new Date()).format('YYYY-MM-DD')):(moment(this.empFormObj.value.endDate).format('YYYY-MM-DD'));
        let eventStartTime =  (moment(this.empFormObj.value.startDate).format('YYYY-MM-DD'))
        let m = moment(eventEndTime);
        let years = (m.diff(eventStartTime, 'years') != 0) ? (m.diff(eventStartTime, 'years')) : '' ;
        m.add(-years, 'years');
        let months = m.diff(eventStartTime, 'months');
        //m.add(-months, 'months');
        //let days = m.diff(eventStartTime, 'days');
       // debugger;
        let countofYearsMonths = (years != '' ? years+ " " + 'Yrs' : '' ) + " " + months + " " + 'Mos';
        console.log(countofYearsMonths);

        this.showSpinner = false;
        let obj = {
          "userEmploymentID": response.userEmploymentId,
          "userID": localStorage.getItem("userId"),
          "companyName": this.auditlogService.encryptAES(this.empFormObj.value.employer),
          "workAddress": this.auditlogService.encryptAES(this.empFormObj.value.city),
          "jobTitle": this.auditlogService.encryptAES(this.empFormObj.value.jobtitle),
          "startDate": (moment(this.empFormObj.value.startDate).format('YYYY-MM-DD')),
          "endDate": (moment(this.empFormObj.value.endDate).format('YYYY-MM-DD')),
          "empResponsibilities": this.empFormObj.value.emp_summary ? this.auditlogService.encryptAES(this.empFormObj.value.emp_summary) : '',
          "currentCompany": this.empFormObj.value.currentCompany,
          "isManual": false,
          "modifiedDateTime": moment(moment().format("YYYY-MM-DD")),
          "countofYearsMonths": countofYearsMonths,


        }
        // userEmploymentId


        
    if(this.editedEmpRecordData){
      this.editEmployment.emit(obj);
    } else {
      this.addEmployment.emit(obj);

    }

      },(error=>{
  
      }));
    }
  }

  ngOnInit(): void {

    // this.resumeBuilderFrom  = FormGroup ({
    // const employeesObjLength = this.employeesArray.length;
    if(this.editedEmpRecordData){
      this.empFormObj = this.fb.group({
       // empId : [ 1 ],
       jobtitle: this.auditlogService.decryptAES(this.editedEmpRecordData.jobTitle),
       employer: this.auditlogService.decryptAES(this.editedEmpRecordData.companyName),
       startDate: (moment(this.editedEmpRecordData.startDate).format('YYYY-MM-DD')),
       endDate: this.isCurrentEmp ? this.currentDate: (moment(this.editedEmpRecordData.endDate).format('YYYY-MM-DD')),
       city: [this.auditlogService.decryptAES(this.editedEmpRecordData.workAddress)],
       emp_summary: this.removeJunk.addBreaks(this.auditlogService.decryptAES(this.editedEmpRecordData.empResponsibilities)),
       currentCompany: [this.editedEmpRecordData.currentCompany]
     });

    } else {
      this.empFormObj = this.fb.group({
       // empId : [ 1 ],
       jobtitle: ['',Validators.required],
       employer: ['',Validators.required],
       startDate: ['',Validators.required],
       endDate: ['',Validators.required],
       city: [''],
       emp_summary: [''],
       currentCompany: [false]

     });

    }
    // return empFormObj;
  // })

      this.checkValue();
  }

  chosenYearHandler(normalizedYear: Moment) {
    //this.endDateCtrl = this.empFormObj.get('endDate') as FormControl;
    //const ctrlValue = this.empFormObj.get('startDate').value;
    //ctrlValue.year(normalizedYear.toDate());
    const val = (normalizedYear.toDate());
    this.empFormObj.get('startDate').setValue(val);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
   // const ctrlValue = this.empFormObj.get('startDate').value;
   // ctrlValue.month(normalizedMonth.month());
    const val = (normalizedMonth.toDate());
    this.empFormObj.get('startDate').setValue(val);
    datepicker.close();
  }

  chosenYearHandler2(normalizedYear: Moment) {
    //this.endDateCtrl = this.empFormObj.get('endDate') as FormControl;
   // const ctrlValue = this.empFormObj.get('endDate').value;
    //ctrlValue.year(normalizedYear.year());
    const val = (normalizedYear.toDate());
    this.empFormObj.get('endDate').setValue(val);
  }

  chosenMonthHandler2(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    //const ctrlValue = this.empFormObj.get('endDate').value;
   // ctrlValue.month(normalizedMonth.month());
    const val = (normalizedMonth.toDate());
    this.empFormObj.get('endDate').setValue(val);
    datepicker.close();
  }

  checkValue(){
   
    //let arr1 = this.empFormObj.get('currentCompany').value;
    this.currentCompanyCtrl = this.empFormObj.get('currentCompany') as FormControl;
     this.isCurrentEmp = this.currentCompanyCtrl.value ? true : false;
     
    if(this.isCurrentEmp){
     
      this.isEditable = true;
      this.currentDate =  (new Date()) ? "Till Date" : '';
      // this.empFormObj.controls.endDate.setValue(currentDate);
       this.endDateCtrl = this.empFormObj.get('endDate') as FormControl;
       this.endDateCtrl.patchValue(this.currentDate, {emitEvent: false, onlySelf: true})
       //this.endDateCtrl.get('startDate').disable()
       
    }else{
      this.isEditable = false;
      this.endDateCtrl = this.empFormObj.get('endDate') as FormControl;
      if(this.editedEmpRecordData) {
        
        this.editedEmpRecordData.endDate
        let date = moment(this.editedEmpRecordData.endDate);
        if(date.isValid()){
        this.currentDate = (this.editedEmpRecordData.endDate != '') ? (moment(this.editedEmpRecordData.endDate).format('YYYY-MM-DD')) : '';
      }else{
        this.currentDate = (moment());
      }
      
    }
      this.endDateCtrl.patchValue(this.currentDate, {emitEvent: false, onlySelf: true})
     // this.endDateCtrl.get('startDate').enable()
       
    }

    
   
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
