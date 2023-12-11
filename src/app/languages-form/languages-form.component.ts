import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import * as moment from 'moment';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-languages-form',
  templateUrl: './languages-form.component.html',
  styleUrls: ['./languages-form.component.css']
})
export class LanguagesFormComponent implements OnInit {

  languagesList: any;
  filteredLanguages: any;
  LanguTypeList: any = [];

  // MasterLanguagesExpert = [
  //   { lookupId : 10009001, lookupValue : "Basic - Familiar"},
  //   { lookupId : 10009002, lookupValue : "Conversational - Limited"},
  //   { lookupId : 10009003, lookupValue : "Conversational - Advanced"},
  //   { lookupId : 10009004, lookupValue : "Fluent"},
  // ];


  //we have to do languagesList Api 
  // languagesList = [
  //   { languageCode : "aa", languageName : "Afar"},
  //   { languageCode : "ab", languageName : "Abkhazian"}
  // ];

  // Editor = ClassicEditorBuild;
  color = "accent";
  resumeBuilderFrom: any;

  //dateMinArrival = new Date();
  dateMinEndDate: any;
  startDateEmp = new Date();
  endDateEmp = new Date();
  languageFormObj: any;
  showSpinner = false;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }
  @Input() masterLanguagesList: any;
  @Input() categoryList: any;
  @Input() languageEditIndex: any;
  @Input() editedLanguageRecordData: any;
  @Output() addLanguage = new EventEmitter<any>();
  @Output() editLanguage = new EventEmitter<any>();
  @Output() closeLanguageForm = new EventEmitter<any>();


  constructor(private auditlogService: AuditlogService, private fb: FormBuilder,
    private userService: UserAuthService,
    private toastr: ToastrService) { }


  ngOnInit(): void {
    console.log(this.categoryList);

    // cur emp status obj
    let curEmpStatusobj = this.categoryList.filter(function (obj: any) {
      return obj.categoryID == 10009;
    });
    this.LanguTypeList = (curEmpStatusobj && curEmpStatusobj.length) ? curEmpStatusobj[0].lookupsList : [];



    if (this.editedLanguageRecordData) {
      let ele = {
        languageCode: this.editedLanguageRecordData.langCode,
        languageName: ""
      };

      let tempObj1 = this.masterLanguagesList.filter(function (obj: any) {
        return obj.languageCode == ele.languageCode;
      });
      if (tempObj1.length) {
        ele.languageName = tempObj1[0].languageName;
      }
      this.languageFormObj = this.fb.group({
        langCode: ele,
        langExpertLookupID: this.editedLanguageRecordData.langExpertLookupID,
      });
    } else {
      this.languageFormObj = this.fb.group({
        langCode: ['',Validators.required],
        langExpertLookupID: ['',Validators.required]
      });
    }

    this.getLanguageList();


  }

  onBlurMethod() {
    console.log(this.languageFormObj.value);
    let touched = true;
    if (this.languageFormObj.status !== "VALID") {
      return;//"error";
    }

    // let aryData = (Object.keys(this.languageFormObj.controls));
    // for (let i = 0; i < aryData.length; i++) {
    //   if (!this.languageFormObj.controls[(aryData[i])].touched) {
    //     touched = false;
    //     break;
    //   }
    // }


    if (this.languageFormObj.valid) {
      console.log("touched all boxes>>>>");
      console.log(this.languageFormObj.value)
      let todo = {
        "userId": localStorage.getItem('userId'),
        "userLangID": 0,
        "langCode": this.languageFormObj.value.langCode.languageCode,
        "langExpertLookupID": this.languageFormObj.value.langExpertLookupID,
        "isManual": 0
      }

      if (this.editedLanguageRecordData) {
        todo.userLangID = this.editedLanguageRecordData.userLangID;
      }
      this.showSpinner = true;

      this.userService.saveoreditlanguagedetails(todo).subscribe(
        (response) => {
          // this.listTodos();
          //console.log(1233);
          this.showSpinner = false;

          let todoObj = {
            "userId": localStorage.getItem('userId'),
            "userLangID": response.userLangID,
            "langCode": this.languageFormObj.value.langCode.languageCode,
            "langExpertLookupID": this.languageFormObj.value.langExpertLookupID,
            "isManual": false
          }
          console.log(todo);

          if (this.editedLanguageRecordData) {
            this.editLanguage.emit(todoObj);
          } else {
            this.addLanguage.emit(todoObj);
          }



        }, (error => {

        }));



    }

  }

  //*********** auto complete  */
  getLanguageList() {

    this.filteredLanguages = this.languageFormObj.get('langCode').valueChanges.pipe(
      startWith(''),
      map(val => val ? this.filterLanguage(val) : this.masterLanguagesList.slice())
    );

    // this.userService.getlanguageslist().subscribe((response:any)=>{
    //     if(response && response.Status){
    //       this.languagesList =  response.languagesList;
    //       this.filteredLanguages = this.languageFormObj.get('langCode').valueChanges.pipe(
    //         startWith(''),
    //         map(val => val ? this.filterLanguage(val): this.languagesList.slice())
    //       );
    //     }
    //   },(error=>{
    // }));
  }

  filterLanguage(val: any): any {
    const filterValue = (val).toString().toLowerCase();
    return this.masterLanguagesList.filter((language: { languageName: string; }) => (language.languageName).toString().toLowerCase().indexOf(filterValue) === 0);
  }

  displayLanguage(languages: any) {
    return languages ? languages.languageName : undefined;
  }



  closeInnerForm() {
    let type: string;
    if (this.editedLanguageRecordData) {
      this.staticAuditLogAPI('64', '');
      type = 'edit';
    } else {
      this.staticAuditLogAPI('61', '');
      type = 'add';
    }
    this.closeLanguageForm.emit(type);
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
