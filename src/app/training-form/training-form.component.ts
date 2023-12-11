import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';

import { MatCalendarCellClassFunction, MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
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
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script. 
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TrainingFormComponent implements OnInit {
  submitted = false
  MasterTrainings: any;
  // MasterTrainings = [
  //   { lookupId : 10006001, lookupValue : "Technical"},
  //   { lookupId : 10006002, lookupValue: 'Profissional'},
  // ];

  // Editor = ClassicEditorBuild;
  color = "accent";
  resumeBuilderFrom: any;

  //dateMinArrival = new Date();
  dateMinEndDate: any;
  startDateEmp = new Date();
  endDateEmp = new Date();
  trainFormObj: any;
  showSpinner = false;
  trainingTypeOpened = false;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }


  @Input() categoryList: any;
  @Input() trainingEditIndex: any;
  @Input() editedTrainRecordData: any;
  @Output() addTraining = new EventEmitter<any>();
  @Output() editTraining = new EventEmitter<any>();
  @Output() closeTrainingForm = new EventEmitter<any>();

  constructor(private auditlogService: AuditlogService, private fb: FormBuilder,
    private userService: UserAuthService,
    private toastr: ToastrService) { }



  ngOnInit(): void {

    // cur emp status obj
    let curEmpStatusobj = this.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10006;
    });
    this.MasterTrainings = (curEmpStatusobj && curEmpStatusobj.length) ? curEmpStatusobj[0].lookupsList : [];


    if (this.editedTrainRecordData) {

      this.trainFormObj = this.fb.group({
        trainingTypeLookupID: this.editedTrainRecordData.trainingTypeLookupID,
        institutionName: this.editedTrainRecordData.institutionName,
        trainingName: this.editedTrainRecordData.trainingName,
        completedYear: this.editedTrainRecordData.completedYear ? (moment(this.editedTrainRecordData.completedYear).format('YYYY-MM-DD')) : '',

      });
    } else {
      this.trainFormObj = this.fb.group({
        trainingTypeLookupID: ['', Validators.required],
        institutionName: ['', Validators.required],
        trainingName: ['', Validators.required],
        completedYear: ['']

      });
    }
  }
  selectClosed(opened: boolean) {
    if (!opened) {
      this.trainingTypeOpened = true;
      this.onBlurMethod();
    }
  }

  onBlurMethod() {

    if (this.trainFormObj.get('trainingName').value === '') {
      this.trainFormObj.get('trainingName').markAsTouched();
    }

    console.log(this.trainFormObj.value);
    let touched = true;
    this.submitted = true;
    if (this.trainFormObj.status !== "VALID") {
      return;//"error";
    }

    // let aryData = (Object.keys(this.trainFormObj.controls));
    // for(let i=0 ; i< aryData.length; i++){
    //   if(!this.trainFormObj.controls[(aryData[i])].touched && aryData[i] != 'trainingTypeLookupID'){
    //     touched = false;
    //     break;
    //   }
    // }

    if (this.trainFormObj.valid) {
      // console.log("touched all boxes>>>>");
      //  console.log(this.trainFormObj.value)
      let todo = {
        "userId": localStorage.getItem('userId'),
        "trainingTypeLookupID": this.trainFormObj.value.trainingTypeLookupID,
        "institutionName": this.auditlogService.encryptAES(this.trainFormObj.value.institutionName),
        "trainingName": this.auditlogService.encryptAES(this.trainFormObj.value.trainingName),
        "completedYear": this.trainFormObj.value.completedYear ? (moment(this.trainFormObj.value.completedYear).format('YYYY-MM-DD')) : '',
        "isManual": 0,
        "userTrainingID": 0

      }
      if (this.editedTrainRecordData) {
        todo.userTrainingID = this.editedTrainRecordData.userTrainingID;
      }
      this.showSpinner = true;


      this.userService.saveoredittrainingdetails(todo).subscribe(
        (response) => {
          // this.listTodos();
          console.log(response);
          this.showSpinner = false;
          let obj = {
            "userTrainingID": response.userTrainingID,
            "userID": localStorage.getItem("userId"),
            "trainingTypeLookupID": this.trainFormObj.value.trainingTypeLookupID,
            "institutionName": this.trainFormObj.value.institutionName,
            "trainingName": this.trainFormObj.value.trainingName,
            "completedYear": this.trainFormObj.value.completedYear ? (moment(this.trainFormObj.value.completedYear).format('YYYY-MM-DD')) : '',
            "isManual": false,
            "modifiedDateTime": moment(moment().format("YYYY-MM-DD"))


          }

          if (this.editedTrainRecordData) {
            this.editTraining.emit(obj);
          } else {
            this.addTraining.emit(obj);
          }

        }, (error => {

        }));
    }
  } //onblurMethod()

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    //this.endDateCtrl = this.empFormObj.get('endDate') as FormControl;
    // console.log("normalizedYear: ", normalizedYear.toDate());
    // const ctrlValue = this.trainFormObj.get('completedYear').value;
    const val = (normalizedYear.toDate());
    this.trainFormObj.get('completedYear').setValue(val);
    datepicker.close();
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.trainFormObj.get('completedYear').value;
    ctrlValue.month(normalizedMonth.month());
    this.trainFormObj.get('completedYear').setValue(ctrlValue);
    datepicker.close();
  }

  closeInnerForm() {
    let type: string;
    if (this.editedTrainRecordData) {
      this.staticAuditLogAPI('50', '');
      type = 'edit';
    } else {
      this.staticAuditLogAPI('47', '');
      type = 'add';
    }
    this.closeTrainingForm.emit(type);
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
