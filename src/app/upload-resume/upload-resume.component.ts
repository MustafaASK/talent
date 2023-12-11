import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient, HttpClientModule, HttpRequest, HttpResponse, HttpEvent
} from "@angular/common/http"
import { Emitters } from '../class/emitters/emitters';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from '../user-auth.service';
import { Observable, of } from 'rxjs';
import { AuditlogService } from '../shared/auditlog.service';

@Component({
  selector: 'app-upload-resume',
  templateUrl: './upload-resume.component.html',
  styleUrls: ['./upload-resume.component.css']
})
export class UploadResumeComponent implements OnInit {

  message = "Hi";
  userFile: any;
  // files:any;
  file: any;
  files: File[] = [];
  fileExt = '';
  uploadedFiles: any;
  showSpinner = false;
  // myFormData:any:FormData//populated by ngfFormData directive
  // httpEvent:HttpEvent<{}>;

  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  constructor(private userService: UserAuthService, private router: Router,
    public HttpClient: HttpClient,
    private auditlogService:AuditlogService,
    private toastr: ToastrService,
    // public HttpEvent:HttpEvent
  ) { }

  url = '';
  onSelectFile(event: any) {
    console.log(event);
    this.staticAuditLogAPI('9', '');
    const allowedExts = ['pdf', 'doc', 'docx'];
    const file = (event.addedFiles.length) ? event.addedFiles[0] : event.rejectedFiles[0];
    const name = file.name;
    const ext = name.substr(name.lastIndexOf('.') + 1).toLowerCase();
    const allowed = allowedExts.some(e => e === ext);
    if (!allowed) {
      this.toastr.error(`File Extension ".${ext}" is not allowed.`);
      return;
    }
    if (file.size > 2097152) {
      // 1,048,576
      this.toastr.error(`File Size shouldn't exceed 2MB.`);
      return;
    }
    this.files.length = 0;
    this.files.push(...event.addedFiles);
    this.fileExt = ext;
    let formData = new FormData();
    let userId: any = localStorage.getItem("userId");
    formData.append("userId", userId);
    formData.append("resume", this.files[0]);
    this.showSpinner = true;

    this.userService.resumeupload(formData).subscribe((response) => {
      console.log(response);
      this.showSpinner = false;
      if (response.Success) {
        this.toastr.success(response.Message);
        this.router.navigate(['/create-upload-resume']);


      } else {
        this.toastr.error(response.Message);

      }

    }, (error => {

    }));
    // for (var i = 0; i < this.uploadedFiles.length; i++) {
    //     formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
    // }
    // this.http.post('/api/upload', formData)
    // .subscribe((response) => {
    //      console.log('response received is ', response);
    // })
    // if (event.target.files && event.target.files[0]) {
    //   var reader = new FileReader();

    //   reader.readAsDataURL(event.target.files[0]); // read file as data url

    //   reader.onload = (event) => { // called once readAsDataURL is completed
    //     // this.url = event.target.result;
    //     console.log(event);
    //   }
    // }
  }
  removeFile(event: any): void {
    event.stopPropagation();
    this.files.length = 0;
    this.fileExt = '';
  }
  ngOnInit(): void {

    if (!this.userService.isUserLoggedIn()) {

      this.router.navigate(['/login']);
      Emitters.authEmitter.emit(false);
    } else {
      
      this.staticAuditLogAPI('7', '');
      Emitters.authEmitter.emit(true);
    }

    

  }

  resumeBuilder(){
    this.staticAuditLogAPI('11', '');
    this.router.navigate(['/resume-builder']);
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

onClickBrowseFile(){
  this.staticAuditLogAPI('8', '');
}

}
