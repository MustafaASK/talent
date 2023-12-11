import { Component, OnInit, Output, EventEmitter, Input, HostListener, ViewChild } from '@angular/core';
// // import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AuditlogService } from '../shared/auditlog.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import * as moment from 'moment';
import { RemoveJunkTextService } from '../shared/services/remove-junk-text.service';


@Component({
  selector: 'app-summary-form',
  templateUrl: './summary-form.component.html',
  styleUrls: ['./summary-form.component.css']
})
export class SummaryFormComponent implements OnInit {
  @ViewChild("quillElement") quillElement: any;
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any) {
    const clickedInside = this.quillElement.nativeElement.contains(targetElement);
    if (!clickedInside && this.focused) {
      // console.log('outside clicked');
      this.onBlurMethod();
      // } else{
      // console.log('clicked inside');
    }
    // console.log('focused: ' + this.focused);
  }


  // Editor = ClassicEditorBuild;
  color = "accent";
  resumeBuilderFrom: any;
  focused = false;

  //dateMinArrival = new Date();
  dateMinEndDate: any;
  startDateEmp = new Date();
  endDateEmp = new Date();
  summaryFormObj: any;
  showSpinner = false;

  pageloading: any

  @Input() SummaryEditIndex: any;
  @Input() editedSummaryRecordData: any;
  @Output() addSummary = new EventEmitter<any>();
  @Output() editSummary = new EventEmitter<any>();
  @Output() closeSummaryForm = new EventEmitter<any>();

  @Output() public dataToParent = new EventEmitter<any>();

  constructor(private auditlogService: AuditlogService, private fb: FormBuilder,
    private userService: UserAuthService,
    private toastr: ToastrService,
    public removeJunk: RemoveJunkTextService) { }

  ngOnInit(): void {
    this.pageloading = true;

    if (this.editedSummaryRecordData) {

      this.summaryFormObj = this.fb.group({
        summaryDesc: this.removeJunk.addBreaks(this.auditlogService.decryptAES(this.editedSummaryRecordData.summaryDesc))
      });
      //  this.summaryFormObj.controls.summaryDesc.setValue(this.summaryFormObj.value.summaryDesc.replace(/•/g, '<br class="manual">•').replace(/➢/g, '<br class="manual">➢'));
    } else {
      this.summaryFormObj = this.fb.group({
        summaryDesc: ['']
      });

    }

  }

  onBlurMethod() {
    // console.log(e); 
    let touched = true;
    // if(this.summaryFormObj.status !== "VALID"){
    //   return;//"error";
    // }

    // let aryData = (Object.keys(this.summaryFormObj.controls));
    // for(let i=0 ; i< aryData.length; i++){
    //   if(!this.summaryFormObj.controls[(aryData[i])].touched){
    //     touched = false;
    //     break;
    //   }
    // }

    if (touched) {
      // console.log("touched all boxes>>>>");
      console.log(this.summaryFormObj.value)
      let todo = {
        "userId": localStorage.getItem('userId'),
        "summaryDesc": this.auditlogService.encryptAES(this.summaryFormObj.value.summaryDesc),
        "isManual": 0,
        "userSummaryID": 0

      }

      if (this.editedSummaryRecordData) {
        //  debugger;
        todo.userSummaryID = this.editedSummaryRecordData.userSummaryID;
      }

      this.showSpinner = true;
      // console.log(this.loginForm.value);
      this.userService.saveoreditcareersummary(todo).subscribe((response) => {
        // this.listTodos();
        console.log(response);
        this.showSpinner = false;
        this.dataToParent.emit({ name: 'careerSummary', careerSummary: this.summaryFormObj.value.summaryDesc });
        let todo = {
          "userId": localStorage.getItem('userId'),
          "summaryDesc": this.auditlogService.encryptAES(this.summaryFormObj.value.summaryDesc),
          "isManual": false,
          "userSummaryID": response.userSummaryID

        }
        console.log(todo);
        //  if(this.editedSummaryRecordData){
        //    //debugger;
        //   this.editSummary.emit(todo);
        // } 

        if (this.editedSummaryRecordData) {
          this.editSummary.emit(todo);
        } else {
          this.addSummary.emit(todo);
        }




      }, (error => {
        this.showSpinner = false;

      }));


    }




  }



  closeInnerForm() {
    let type: string;
    if (this.editedSummaryRecordData) {
      type = 'edit';
    } else {
      type = 'add';
    }
    this.closeSummaryForm.emit(type);
  }




}
