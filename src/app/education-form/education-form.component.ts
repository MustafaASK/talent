import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup,FormControl, Validators,FormArray } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';

import {MatCalendarCellClassFunction, MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.css'],
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
export class EducationFormComponent implements OnInit {

 MasterEducations = [
    {userEducationId: '1', userEducationName: 'Bachelors'},
    {userEducationId: '2', userEducationName: 'Masters'},
   
  ];

  // Editor = ClassicEditorBuild;
  color = "accent";
  resumeBuilderFrom:any;
  showSpinner = false;
  degreeTypeOpened = false;


  //dateMinArrival = new Date();
  dateMinEndDate : any;
  startDateEmp = new Date();
  endDateEmp = new Date();
  eduFormObj:any;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  @Input() editedEduRecordData:any;  
  @Input() educationEditIndex:any;  
  @Output() addEducation = new EventEmitter<any>();
  @Output() editEducation = new EventEmitter<any>();
  @Output() closeEducationForm = new EventEmitter<any>();

  constructor(private auditlogService:AuditlogService,private fb:FormBuilder,    
    private userService: UserAuthService,
    private toastr: ToastrService) { }

    closeInnerForm(){
      let type:string;
      if(this.editedEduRecordData){
        this.staticAuditLogAPI('29', '');
        type = 'edit';
      } else {
        this.staticAuditLogAPI('26', '');
        type = 'add';
      }
      this.closeEducationForm.emit(type);
    }



  capitalizeFirstLetter(str:any) {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }
    

    
  ngOnInit(): void {

    

    if(this.editedEduRecordData){
      var degreeType =  this.capitalizeFirstLetter(this.auditlogService.decryptAES(this.editedEduRecordData.degreeType));
      this.eduFormObj = this.fb.group({
        degreeType: degreeType, 
        schoolName: this.auditlogService.decryptAES(this.editedEduRecordData.schoolName),
        degreeName: this.auditlogService.decryptAES(this.editedEduRecordData.degreeName),
        degreeCompletionDate: (moment(this.editedEduRecordData.degreeCompletionDate).format('YYYY-MM-DD')),

      });
    } else {
      this.eduFormObj = this.fb.group({
        degreeType: ['',Validators.required],
        schoolName: ['',Validators.required],
        degreeName: ['',Validators.required],
        degreeCompletionDate: ['',Validators.required]
       
      });
    }
    
  }
  selectClosed(opened: boolean){
    if(!opened){
      this.degreeTypeOpened= true;
      this.onBlurMethod();
    }
  }

  onBlurMethod(){
    console.log(this.eduFormObj.value); 
    let touched = true;
    if(this.eduFormObj.status !== "VALID"){
      console.log(1);
      return;//"error";
    }
    let aryData = (Object.keys(this.eduFormObj.controls));
    for(let i=0 ; i< aryData.length; i++){
      if(!this.eduFormObj.controls[(aryData[i])].touched && aryData[i] != 'degreetype'){
        touched = false;
        break;
      }
    }

    if(this.eduFormObj.valid){
        console.log("touched all boxes>>>>");
        console.log(this.eduFormObj.value)
       
        let todo = {
          "userId" : localStorage.getItem('userId'),
          "degreeType" : this.auditlogService.encryptAES(this.eduFormObj.value.degreeType),
          "schoolName" : this.auditlogService.encryptAES(this.eduFormObj.value.schoolName),
          "degreeName" : this.auditlogService.encryptAES(this.eduFormObj.value.degreeName),
          "degreeCompletionDate": (moment(this.eduFormObj.value.degreeCompletionDate).format('YYYY-MM-DD')),
          "isManual" : 0,
          "userEducationId":0
         
        }
        if(this.editedEduRecordData){
          todo.userEducationId = this.editedEduRecordData.userEducationID;
        }
        this.showSpinner = true;
        this.userService.saveorediteducationdetails(todo).subscribe(
          (response)=>{
              // this.listTodos();
              console.log(response);
              this.showSpinner = false;

              let obj = {
                "userEducationID": response.userEducationId,
                "userID": localStorage.getItem("userId"),
                "degreeType" : this.auditlogService.encryptAES(this.eduFormObj.value.degreeType),
                "schoolName" : this.auditlogService.encryptAES(this.eduFormObj.value.schoolName),
                "degreeName" : this.auditlogService.encryptAES(this.eduFormObj.value.degreeName),
                "degreeCompletionDate": (moment(this.eduFormObj.value.degreeCompletionDate).format('YYYY-MM-DD')),
                "isManual": false,
                "modifiedDateTime": moment(moment().format("YYYY-MM-DD"))

                
              }

              if(this.editedEduRecordData){
                this.editEducation.emit(obj);
              } else {
                this.addEducation.emit(obj);
          
              }
      
             },(error=>{
  
      }));
    }
  } //onblurMethod()

  // chosenYearHandler(normalizedYear: Moment) {
  //   //this.endDateCtrl = this.empFormObj.get('endDate') as FormControl;
  //   const ctrlValue = this.eduFormObj.get('degreeCompletionDate').value;
  //   ctrlValue.year(normalizedYear.year());
  //   this.eduFormObj.get('degreeCompletionDate').setValue(ctrlValue);
  // }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    //this.endDateCtrl = this.empFormObj.get('endDate') as FormControl;
    // console.log("normalizedYear: ", normalizedYear.toDate());
    // const ctrlValue = this.LCFormObj.get('completedYear').value;
    const val = (normalizedYear.toDate());
    this.eduFormObj.get('degreeCompletionDate').setValue(val);
    datepicker.close();
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.eduFormObj.get('degreeCompletionDate').value;
    ctrlValue.month(normalizedMonth.month());
    this.eduFormObj.get('degreeCompletionDate').setValue(ctrlValue);
    datepicker.close();
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

