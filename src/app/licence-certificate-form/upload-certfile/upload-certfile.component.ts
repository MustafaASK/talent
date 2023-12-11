import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-upload-certfile',
  templateUrl: './upload-certfile.component.html',
  styleUrls: ['./upload-certfile.component.css']
})
export class UploadCertfileComponent implements OnInit {

  bsModalRef2: BsModalRef | undefined;

  uploadCertFormObj:any;
  constructor(public bsModalRef: BsModalRef,public fb:FormBuilder) {}

  ngOnInit(): void {
     this.uploadCertFormObj = this.fb.group({
      uploadCertFile:['']
     });
  }

  submit(){
    console.log(this.uploadCertFormObj);
    this.uploadCertFormObj.controls.uploadCertFile.value;
  }

 

}
