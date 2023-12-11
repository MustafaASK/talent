import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgAudioRecorderService, OutputFormat } from 'ng-audio-recorder';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from '../shared/auditlog.service';
import { UserAuthService } from '../user-auth.service';

@Component({
  selector: 'app-record-audio',
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.css']
})
export class RecordAudioComponent implements OnInit {

  recording = 'toStart';

  hours = 0;
  mins = 0;
  seconds = 0;
  disHours: number | string = "00";
  disMins: number | string = "00";
  disSeconds: number | string = "00";
  timer: any;
  audioSrc: any = null;
  showSpinner: boolean = false;

  orderId = "";
  assessmentid = "";

  firstName: any;
  lastName: any;
  audioFile: any;
  textToRead = "The only person for whom the house was in any way special was Arthur Dent, and that was only because it happened to be the one he lived in. He had lived in it for about three years, ever since he had moved out of London because it made him nervous and irritable.";

  constructor(
    private audioRecorderService: NgAudioRecorderService,
    public domSanitizer: DomSanitizer,
    public cd: ChangeDetectorRef,
    private actRoute: ActivatedRoute,
    private userService: UserAuthService,
    private toastr: ToastrService,
    private router: Router,
    private auditlogService: AuditlogService
  ) { }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }


  startRecording() {
    this.recording = "started";
    this.audioRecorderService.startRecording();
    this.startTimer();
  }

  stopRecording() {
    clearTimeout(this.timer);
    this.recording = "stopped";
    this.audioRecorderService.stopRecording(OutputFormat.WEBM_BLOB).then((output) => {
      // do post output steps
      this.audioFile = output;
      this.audioSrc = URL.createObjectURL(output);
      // console.log(output);
      // this.audioSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(output);
      // const file = new File([output], "voice.mp3");
      // this.audioSrc = URL.createObjectURL(file);
      setTimeout(() => {
        this.cd.detectChanges();
      }, 500);

      // this.audioSrc = output;
      console.log(output);
    }).catch(errrorCase => {
      // Handle Error
    });
    this.hours = 0;
    this.mins = 0;
    this.seconds = 0;
    this.disHours = "00";
    this.disMins = "00";
    this.disSeconds = "00";
  }
  reRecording() {
    this.recording = 'toStart';
  }
  submitForm() {
    // formData.append('text', $('#textToRecord').val());
    // formData.append('formName', 'test ' + new Date().toDateString());
    // formData.append('audio', blob);
    console.log(this.textToRead);

    let formData = new FormData();
    formData.append("text", this.textToRead);
    formData.append("formName", this.firstName + ' ' + this.lastName);
    formData.append("audio", this.audioFile);
    this.showSpinner = true;

    this.userService.saveAudio(formData).subscribe((response) => {
      this.showSpinner = false;
      this.getAssessmentJson(response.trim());
      console.log(response.trim());

    }, (error => {

    }));
  }
  startTimer() {
    this.timer = setTimeout(() => {
      this.seconds++;
      if (this.seconds > 59) {
        this.seconds = 0;
        this.mins++;
        if (this.mins > 59) {
          this.mins = 0;
          this.hours++;
          if (this.hours < 10) {
            this.disHours = '0' + this.hours + ':';
          } else {
            this.disHours = this.hours + ':';
          }
        }

        if (this.mins < 10) {
          this.disMins = '0' + this.mins + ':';
        } else {
          this.disMins = this.mins + ':';
        }
      }
      if (this.seconds < 10) {
        this.disSeconds = '0' + this.seconds;
      } else {
        this.disSeconds = this.seconds;
      }


      this.startTimer();
    }, 1000);
  }
  getAssessmentJson(fileName: string) {

    // let formData = new FormData();
    // formData.append("text", this.textToRead);
    // formData.append("filename", fileName);

    let params = new HttpParams();
    params = params.append('text', this.textToRead);
    params = params.append('filename', fileName);

    this.showSpinner = true;
    this.userService.getAudioJson(params).
      subscribe((response: any) => {
        this.showSpinner = false;
        this.saveAssessmentScore(JSON.parse(response));

      }, (error => {

      }));
  }
  saveAssessmentScore(json: string) {
    let dataToPass = {
      "userId": localStorage.getItem('userId'),
      "orderId": this.orderId,
      "assessmentsJson": JSON.stringify(json)
    }
    // {
    // 	"userId":"349",
    // 	"orderId":"fJYkWrU020",
    // 	"assessmentsJson":""
    // }

    this.showSpinner = true;
    this.userService.saveAssessmentScore(dataToPass).
      subscribe((response: any) => {
        this.showSpinner = false;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Status == 200) {
          // if (this.assessmentsId == "JB-ACCUICKEVP") {
          //   this.goToRecorder();
          // } else {
          //   this.goToAssessment();
          // }

          this.router.navigate(['/redirectassessment']);
        }

      }, (error => {

      }));
  }

  ngOnInit(): void {
    this.actRoute.queryParams
      .subscribe(params => {
        // console.log(params);  
        this.orderId = (params && params.oId) ? params.oId : '';
        this.assessmentid = (params && params.id) ? params.id : '';
      });
      
    this.firstName = (localStorage.getItem('firstName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('firstName') || '{}')) : '';
    this.lastName = (localStorage.getItem('lastName') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('lastName') || '{}')) : '';
  }

}
