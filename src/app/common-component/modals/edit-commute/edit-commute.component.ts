import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { UserAuthService } from 'src/app/user-auth.service';
import { environment } from 'src/environments/environment';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FindJobsComponent } from 'src/app/find-jobs/find-jobs.component';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-edit-commute',
  templateUrl: './edit-commute.component.html',
  styleUrls: ['./edit-commute.component.css']
})
export class EditCommuteComponent implements OnInit {

  title = 'google-places-autocomplete';
  userAddress: string = ''
  userLatitude: string = ''
  userLongitude: string = ''
  options: any = [];
  placeOptions: any = {
    types: ['(cities)']
  };

  // verifycodeForm:FormGroup;
  editCommuteForm: FormGroup;
  control = new FormControl('');
  maxTimeItems = ['15', '30', '45', '60']
  selectedGetMaxTimeCont: string | null = null



  transpotationItems = [
    { name: 'DRIVING', imagePath: 'assets/icons/car@2x.svg' },
    { name: 'TRANSIT', imagePath: 'assets/icons/Vector@2x.svg' },
    { name: 'WALKING', imagePath: 'assets/icons/Group 66@2x.svg' },
    { name: 'CYCLING', imagePath: 'assets/icons/Group 67@2x.svg' },
    // Add more items as needed with their respective image paths
  ];
  selectedTranspotation: string | null = null




  auditObj = {
    actionId: '',
    userId: '',
    jsonData: ''
  }

  value: string = '';
  textCopied = false;
  @ViewChild('locationFilter') locationFilter: ElementRef | undefined;
  constructor(
    private formBuild: FormBuilder,
    private authService: AuthService,
    // private edit-commuteModule: edit-commuteModule,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditCommuteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditlogService: AuditlogService,
    private userService: UserAuthService,
    private toastr: ToastrService
  ) {
    // this.verifycodeForm  = formBuilder.group({
    //   // email : new FormControl({value:this.emailId,disabled:true},[Validators.required,Validators.email]),
    //   // email: ['', Validators.required,Validators.email],
    //    confirmOtp : new FormControl('https://app.csninja.com/csninja/login')
    //  });
    console.log(data);
    this.editCommuteForm = formBuild.group({
      // candname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      // status: ['', Validators.required],
      startingLocation: [data.commuteData.startingLocation ? data.commuteData.startingLocation : ''],
      maximumTimeInMinutes: [(data.commuteData.maximumTimeInMinutes ? data.commuteData.maximumTimeInMinutes : '')],
      transportation: [(data.commuteData.preferredTransportation ? data.commuteData.preferredTransportation : '')],
      trafficEstimate: [(data.commuteData.includeTrafficEstimate ? data.commuteData.includeTrafficEstimate : 'BUSY_HOUR')],


    });
    this.userAddress = data.commuteData.startingLocation;
    this.selectedGetMaxTimeCont = (data.commuteData.maximumTimeInMinutes ? data.commuteData.maximumTimeInMinutes : '');
    this.selectedTranspotation = (data.commuteData.preferredTransportation ? data.commuteData.preferredTransportation : '');

  }


  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address
    this.userLatitude = address.geometry.location.lat()
    this.userLongitude = address.geometry.location.lng()

    // this.locationFilter?.nativeElement.focus();
  }

  startOver(): void {
    const startingLocationControl = this.editCommuteForm.get('startingLocation');
    if (startingLocationControl) {
      startingLocationControl.setValue('');
    }

    const maximumTimeInMinutesControl = this.editCommuteForm.get('maximumTimeInMinutes');
    if (maximumTimeInMinutesControl) {
      maximumTimeInMinutesControl.setValue('');
    }

    this.selectedGetMaxTimeCont = null;

    const transportationControl = this.editCommuteForm.get('transportation');
    if (transportationControl) {
      transportationControl.setValue('');
    }

    this.selectedTranspotation = null;

    const trafficEstimateControl = this.editCommuteForm.get('trafficEstimate');
    if (trafficEstimateControl) {
      trafficEstimateControl.setValue('BUSY_HOUR');
    }



    this.userAddress = '';
    this.selectedGetMaxTimeCont = '';
    this.selectedTranspotation = '';



    // this.editCommuteForm.value.maximumTimeInMinutes = '';
    // this.editCommuteForm.value.startingLocation = '';
    // this.editCommuteForm.value.transportation = '';
    // this.editCommuteForm.value.trafficEstimate = 'BUSY_HOUR';

    // this.selectedGetMaxTimeCont = '';

    this.selectedTranspotation = '';
    this.editCommuteForm.patchValue({
      startingLocation: '',
      trafficEstimate: 'BUSY_HOUR',
      maximumTimeInMinutes: '',
      transportation: ''
    });



  }



  copyText(): void {
    this.staticAuditLogAPI('151', JSON.stringify(this.value));

    this.textCopied = true;
  }

  placeSelected(event: any, data: any, trigger: MatAutocompleteTrigger) {

    if (data.data.entries <= 1) {

      this.editCommuteForm.patchValue({
        startingLocation: data.name,
      });
      this.userAddress = data.name;



    } else {
      this.editCommuteForm.patchValue({
        startingLocation: data.name,
      });
      this.userAddress = data.name;
      this.options = [];


      let queryParam = "key=" + environment.smartyKey + "&search=" + (data.data.street_line) + "&source=all&selected=" + (data.callName) + ""

      this.userService.smartyStreetsSearch(queryParam).subscribe((response) => {
        console.log(response);
        for (let i = 0; i < response.suggestions.length; i++) {
          let name = this.buildAddress(response.suggestions[i]);
          let callName = this.buildAddressForCall(response.suggestions[i]);
          let obj = {
            "name": name,
            "callName": callName,
            "data": response.suggestions[i]
          }

          this.options.push(obj);

        }

        // event.stopPropagation();
        trigger.openPanel();
      }, (error => {

      }));
    }

  }


  buildAddress(suggestion: any) {
    let whiteSpace = "";
    let sentanse = JSON.parse(JSON.stringify(suggestion));
    if (sentanse.secondary) {
      if (sentanse.entries > 1) {
        sentanse.secondary += " (" + sentanse.entries + " entries)";
      }
      whiteSpace = " ";
    }
    return sentanse.street_line + whiteSpace + sentanse.secondary + " " + sentanse.city + ", " + sentanse.state + " " + sentanse.zipcode;
  }
  buildAddressForCall(suggestion: any) {
    let whiteSpace = "";
    let sentanse = JSON.parse(JSON.stringify(suggestion));
    if (sentanse.secondary) {
      if (sentanse.entries > 1) {
        sentanse.secondary += " (" + sentanse.entries + ")";
      }
      whiteSpace = " ";
    }
    return sentanse.street_line + whiteSpace + sentanse.secondary + " " + sentanse.city + " " + sentanse.state + ", " + sentanse.zipcode;
  }
  onAutocompleteSelected(res: any) {
    this.options = [];

    let queryParam = "";
    queryParam = "key=" + environment.smartyKey + "&search=" + (this.editCommuteForm.value.startingLocation) + "&selected=&source=all";

    this.userService.smartyStreetsSearch(queryParam).subscribe((response) => {
      // let response = {"suggestions":[{"street_line":"Lucas Building","secondary":"","city":"Des Moines","state":"IA","zipcode":"50319","entries":0},{"street_line":"Lucas Building","secondary":"Fl","city":"Des Moines","state":"IA","zipcode":"50319","entries":3},{"street_line":"Lucas Building","secondary":"Rm","city":"Des Moines","state":"IA","zipcode":"50319","entries":18}]};

      for (let i = 0; i < response.suggestions.length; i++) {
        let name = this.buildAddress(response.suggestions[i]);
        let callName = this.buildAddressForCall(response.suggestions[i]);
        let obj = {
          "name": name,
          "callName": callName,
          "data": response.suggestions[i]
        }

        this.options.push(obj);

      }

    }, (error => {

    }));

  }


  startingLocationChange(ev: any): void {
    console.log(ev.target.value)
    this.userAddress = ev.target.value;
    // console.log("editCommute starting location", this.editCommuteForm.value.startingLocation)
  }

  clearLocation() {
    this.editCommuteForm.value.startingLocation = '';
    this.userAddress = '';
    const startingLocationControl = this.editCommuteForm.get('startingLocation');
    if (startingLocationControl) {
      startingLocationControl.setValue(['']);
    }
    this.locationFilter?.nativeElement.focus();
  }





  ngOnInit(): void {
    if (this.userAddress.trim() == '') {
      this.userService.getIpAddress().subscribe(
        (response: any) => {

          console.log("response edit commute", response)
          console.log(this.editCommuteForm.value.startingLocation);
          this.editCommuteForm.patchValue({
            startingLocation: response.city + ',' + response.region

          });
          this.userAddress = response.city + ',' + response.region
        },
        (error: any) => { }
      );

    }



    this.value = environment.FrontEndURLForUser + 'preview/' + this.data.commuteData.profileId;
    this.staticAuditLogAPI('149', '');



  }

  // updateCommute(): void {
  //     this.authService.executeTriggerFunction();

  // }



  handleClickGetMaxTime(item: string): void {
    console.log("maxTimeItem", item)
    // this.editCommuteForm.value.maximumTimeInMinutes = item

    this.editCommuteForm.patchValue({
      maximumTimeInMinutes: item
    });
    this.selectedGetMaxTimeCont = item
  }

  handleClickTrans(item: string): void {
    this.selectedTranspotation = item
    this.editCommuteForm.patchValue({
      transportation: item
    });
    // this.editCommuteForm.value.transportation = item
  }

  trafficEstYes(): void {

    // this.editCommuteForm.value.trafficEstimate = "BUSY_HOUR";
    this.editCommuteForm.patchValue({
      trafficEstimate: 'BUSY_HOUR'
    });

  }

  trafficEstNo(): void {

    this.editCommuteForm.value.trafficEstimate = "TRAFFIC_FREE";
    console.log("editCommute Traffic Estimate", this.editCommuteForm.value.trafficEstimate)

  }

  onClose(): void {

    this.dialogRef.close();
    this.staticAuditLogAPI('150', '');




  }

  saveCommute(): void {
    if (!this.userAddress) {
      return;
    }

    this.dialogRef.close(
      {
        startingLocation: this.userAddress ? this.userAddress : this.editCommuteForm.value.startingLocation,
        maximumTimeInMinutes: this.editCommuteForm.value.maximumTimeInMinutes,
        preferredTransportation: this.editCommuteForm.value.transportation,
        includeTrafficEstimate: this.editCommuteForm.value.trafficEstimate,
        latitude: this.userLatitude,
        langitude: this.userLongitude

      });
    this.staticAuditLogAPI('150', '');
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
