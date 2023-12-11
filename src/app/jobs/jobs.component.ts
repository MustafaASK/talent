import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from '../class/emitters/emitters';
import { ShowJobComponent } from '../common-component/modals/show-job/show-job.component';
import { AuditlogService } from '../shared/auditlog.service';
import { RemoveJunkTextService } from '../shared/services/remove-junk-text.service';
import { environment } from 'src/environments/environment';
import { UserAuthService } from '../user-auth.service';
import { MapsAPILoader } from '@agm/core';
import { EditCommuteComponent } from '../common-component/modals/edit-commute/edit-commute.component';


export interface Job {
  jobtitle: string;
  compname: string;
  city: string;
  state: string;
  date: string;
  description: string;
  descShort: string;
  payrange: string;
  payrange1: Number | string;
  payrange2: Number | string;
  paytype: string;
  applied: Boolean;
  jobid: number;
}
export interface JobType {
  lookupId: number;
  lookupScreenDesc: string;
  lookupValue: string;
}
export interface AssessmentRequired {
  id: number;
  name: string;
}
export interface AppliedJob {
  accuickJobId: number;
  city: string;
  clientName: string;
  jobTitle: string;
  state: string;
  userId: number;
  userJobId: number;
  zipcode: string;
  isChecked: Boolean;
  payrange: string;
  payrange1: Number | string;
  payrange2: Number | string;
  payRate: string;
  paytype: string;
  jobType: string;
  description: string;
  appliedDate: string;
}

export interface AllData {
  searchTextSnippet_: string,
  job_: {
    employmentTypes_: [],
    addresses_: {}, postingUpdateTime_: { seconds_: number },
    description_: string,
    title_: string,
    requisitionId_: string,
    customAttributes_: {
      mapData: {
        isRemote: {
          stringValues_: string | null
        }
      }
    }
  },
  jobSummary_: string,
  commuteInfo_: object,
  memoizedHashCode: number,
  jobCategories_: object | null,
  memoizedIsInitialized: number,
  jobTitleSnippet_: string,
  unknownFields: object,
  memoizedSize: number
}
export interface TitleAuto {
  title: string;
}

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent implements OnInit {
  SuggestionsList = ['Try another keyword and location above', 'Increase your search radius in filters', 'Try removing filters to find additional jobs']

  filteredStreets: TitleAuto[] = [];
  myForm: FormGroup;
  isApiLoaded = false;
  placeOptions: any = {
    types: ['(cities)']
  };
  userAddress: string = '';
  userLatitude: string = '';
  userLongitude: string = '';
  jobsTab = true;
  jobForm: FormGroup;
  jobsList: Job[] = [];
  jobtypes: JobType[] = [];
  jobsAppliedList: AppliedJob[] = [];
  myRequiredAssessments: AssessmentRequired[] = [];
  selectedJob: any;
  showSpinner = false;
  searched = false;
  selectedIndex: number = 0;
  errorTxt = 'No Recommended Jobs Found';
  isMobile = false;
  filtersHide = true;
  jobIdFromMail = null;
  showLoader = false;
  auditObj = {
    actionId: '',
    userId: '',
    jsonData: '',
  };
  currentPage = 1;


  totalData: AllData[] = [];
  editCommuteObj = {
    startingLocation: '',
    maximumTimeInMinutes: "",
    preferredTransportation: "",
    includeTrafficEstimate: false,
    latitude: "",
    langitude: ""
  };
  filterObject = {
    "jobType": "All Job Types",
    "dateposted": "0",
    "distance": "0",
    "isRemote": false
  }

  showDetailDescription = false;
  selectedRecord = {
    job_: {
      employmentTypes_: [],
      title_: '', addresses_: {}, postingUpdateTime_: { seconds_: 0 }, description_: "", requisitionId_: "",
      customAttributes_: {
        mapData: {
        }
      }
    },
    jobTitleSnippet_: ""
  }
  totalSize: number = 0;
  assessmentsAry: any;
  badgesPath: any;
  isassessSectionScrolled = false;

  jobTypesList =
    {
      "1": "Full Time",
      "2": "Part Time",
      "3": "Contract",
      "4": "Contract To Hire",
      "5": "Temporary",
      "6": "Intership",
      "7": "Volunteer"
    };
  // @ViewChild('jobDetail', { read: ElementRef }) public jobDetail: ElementRef | undefined;
  @ViewChild('jobDetail') jobDetail: ElementRef | undefined;
  jobIdToLoad: any;

  @ViewChild('whereFilter') whereFilter: ElementRef | undefined;

  constructor(
    public dialog: MatDialog,
    private formBuild: FormBuilder,
    private userService: UserAuthService,
    private auditlogService: AuditlogService,
    private toastr: ToastrService,
    public rj: RemoveJunkTextService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader
  ) {
    // if(this.actRoute.snapshot.params.id){
    //   this.jobIdFromMail = this.actRoute.snapshot.params.id;
    //   localStorage.setItem('mailJobId', this.actRoute.snapshot.params.id);
    // }

    this.badgesPath = environment.badgesPath;
    this.jobForm = formBuild.group({
      // candname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      // status: ['', Validators.required],
      keyWords: [''],
      location: [''],
      jobType: [''],
      hours: [''],
      payRate: [''],
    });

    this.myForm = formBuild.group({
      // candname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      // status: ['', Validators.required],
      // keyWords: [''],
      // location: [''],
      // jobType: [''],
      // hours: [''],
      // payRate: [''],
      control: [''],
      where: ['']
    });

  }


  jobsearch() {
    console.log(this.myForm.value);
    console.log("editCommuteObj", this.editCommuteObj)
    var dataToPass = {
      "jobquery": [
        {
          "commuteFilter": {},
          "query": this.myForm.value.control ? this.myForm.value.control : '',
          "jobType": this.filterObject.jobType,
          "datePosted": this.filterObject.dateposted,
          "isRemote": this.filterObject.isRemote,
          "locationFilters": [
            {
              "address": this.myForm.value.where ? this.myForm.value.where : '',
              "distanceInMiles": this.filterObject.distance
            }
          ]


        }
      ],

      "searchMode": "JOB_SEARCH",
      "disableKeywordMatch": false,
      "enableBroadening": false,
      "keywordMatchMode": "KEYWORD_MATCH_TITLE_ONLY",
      "offset": this.totalData.length
    }

    if (this.editCommuteObj.preferredTransportation || this.editCommuteObj.includeTrafficEstimate || this.editCommuteObj.maximumTimeInMinutes) {
      dataToPass.jobquery[0].commuteFilter = [{
        "commuteMethod": this.editCommuteObj.preferredTransportation ? this.editCommuteObj.preferredTransportation : 'TRANSIT',
        "roadTraffic": this.editCommuteObj.includeTrafficEstimate,
        "allowImpreciseAddresses": false,
        "travelDuration": this.editCommuteObj.maximumTimeInMinutes ? this.editCommuteObj.maximumTimeInMinutes : 30,
        "startCoordinates":
        {
          "latitude": this.userLatitude,
          "longitude": this.userLongitude,
        },

        "departureTime": {
          "hours": 0,
          "minutes": 0,
          "nanos": 0,
          "seconds": 0
        }
      }]
      // dataToPass.jobquery[0].ani = 'dd';
    } else {
      dataToPass.jobquery.forEach(function (item: any, i: number) {
        if (i == 0) {
          delete item.commuteFilter;
        }
      });
      // delete dataToPass.jobquery[0]["commuteFilter"];
    }
    this.showLoader = true;

    this.userService.jobsearch(dataToPass).subscribe(
      (response: any) => {
        this.showLoader = false;
        console.log(response)
        if (response.success) {
          this.totalSize = response.totalSize;
          // debugger
          if (response.jobList && response.jobList.length) {
            if (this.totalData.length == 0) {
              this.selectedRecord = response.jobList[0];
            }
            this.totalData = this.totalData.concat(response.jobList)
          }
          // this.totalData = response.jobList;//[{"searchTextSnippet_":"The <b>Project Manager</b> will support the Director and other members of the Customer and Portfolio Marketing Group with project management. At any given time, there may be 10-20 different projects that&nbsp;...","job_":{"jobBenefits_":[],"postingUpdateTime_":{"memoizedHashCode":0,"memoizedIsInitialized":-1,"seconds_":1692688101,"nanos_":533000000,"unknownFields":{"fields":{}},"memoizedSize":-1},"company_":"projects/onboarding-places/tenants/ab9fd9c3-2384-4c5a-bddc-b39347aed370/companies/067b2810-ce86-4f76-b9f0-e011878ec44c","promotionValue_":0,"requisitionId_":"230447","languageCode_":"en-US","postingExpireTime_":{"memoizedHashCode":0,"memoizedIsInitialized":-1,"seconds_":1698560975,"nanos_":0,"unknownFields":{"fields":{}},"memoizedSize":-1},"responsibilities_":"","postingPublishTime_":{"memoizedHashCode":0,"memoizedIsInitialized":-1,"seconds_":1692688101,"nanos_":939000000,"unknownFields":{"fields":{}},"memoizedSize":-1},"name_":"projects/onboarding-places/tenants/ab9fd9c3-2384-4c5a-bddc-b39347aed370/jobs/140562625906778822","jobBenefitsMemoizedSerializedSize":0,"memoizedSize":-1,"applicationInfo_":{"emails_":[],"instruction_":"","memoizedHashCode":0,"memoizedIsInitialized":-1,"uris_":["https://www4.accuick.com/Accuick/JobsUpdate1.jsp?txtJobid=230447"],"unknownFields":{"fields":{}},"memoizedSize":-1},"postingRegion_":0,"addresses_":["Lawrence Township, NJ, 08648"],"qualifications_":"","visibility_":1,"description_":"<p><br></p><p>Customer, Portfolio &amp; Value Generation (CPVG)</p><p>Veeva PromoMats</p><p>MS Project</p><p>Project Manager in Customer, Portfolio &amp; ................","employmentTypesMemoizedSerializedSize":0,"degreeTypesMemoizedSerializedSize":0,"employmentTypes_":[1,3],"memoizedHashCode":0,"jobLevel_":0,"memoizedIsInitialized":-1,"companyDisplayName_":"Cxninja SmartBot","unknownFields":{"fields":{}},"incentives_":"","derivedInfo_":{"locations_":[{"locationType_":5,"latLng_":{"longitude_":-74.72200169999999,"memoizedHashCode":0,"latitude_":40.2912966,"memoizedIsInitialized":-1,"unknownFields":{"fields":{}},"memoizedSize":-1},"memoizedHashCode":0,"postalAddress_":{"languageCode_":"","revision_":0,"addressLines_":["Trenton, NJ 08648, USA"],"memoizedHashCode":0,"recipients_":[],"memoizedIsInitialized":-1,"locality_":"Trenton","unknownFields":{"fields":{}},"memoizedSize":-1,"sortingCode_":"","organization_":"","regionCode_":"US","administrativeArea_":"NJ","postalCode_":"08648","sublocality_":""},"radiusMiles_":0.0025856577151864516,"memoizedIsInitialized":-1,"unknownFields":{"fields":{}},"memoizedSize":-1}],"jobCategories_":[18],"memoizedHashCode":0,"jobCategoriesMemoizedSerializedSize":0,"memoizedIsInitialized":-1,"unknownFields":{"fields":{}},"memoizedSize":-1},"title_":"Project Manager","degreeTypes_":[],"department_":"","customAttributes_":{"mode":"MAP","mapData":{"assessment":{"longValuesMemoizedSerializedSize":-1,"stringValues_":["ALL"],"filterable_":true,"memoizedHashCode":0,"longValues_":[],"keywordSearchable_":true,"memoizedIsInitialized":-1,"unknownFields":{"fields":{}},"memoizedSize":-1},"isRemote":{"longValuesMemoizedSerializedSize":-1,"stringValues_":["false"],"filterable_":true,"memoizedHashCode":0,"longValues_":[],"keywordSearchable_":true,"memoizedIsInitialized":-1,"unknownFields":{"fields":{}},"memoizedSize":-1},"payrange":{"longValuesMemoizedSerializedSize":-1,"stringValues_":["DOE"],"filterable_":true,"memoizedHashCode":0,"longValues_":[],"keywordSearchable_":true,"memoizedIsInitialized":-1,"unknownFields":{"fields":{}},"memoizedSize":-1},"status":{"longValuesMemoizedSerializedSize":-1,"stringValues_":["Knowledge Bank"],"filterable_":true,"memoizedHashCode":0,"longValues_":[],"keywordSearchable_":true,"memoizedIsInitialized":-1,"unknownFields":{"fields":{}},"memoizedSize":-1}},"isMutable":false,"converter":{}},"postingCreateTime_":{"memoizedHashCode":0,"memoizedIsInitialized":-1,"seconds_":1692688101,"nanos_":533000000,"unknownFields":{"fields":{}},"memoizedSize":-1}},"jobSummary_":"The Project Manager will support the Director and other members of the Customer and Portfolio Marketing Group with project management. At any given time, there may be 10-20 different projects that Marketers are leading with agencies and consultancies supporting them..","commuteInfo_":{"memoizedHashCode":0,"memoizedIsInitialized":-1,"unknownFields":{"fields":{}},"memoizedSize":-1},"memoizedHashCode":0,"jobCategories_":["MANAGEMENT"],"memoizedIsInitialized":-1,"jobTitleSnippet_":"<b>Project Manager</b>","unknownFields":{"fields":{}},"memoizedSize":-1}];
          if (response.jobList && response.jobList.length) {
            this.selectedRecord = response.jobList[0];
          }

        }
        if (response.Error) {
          this.toastr.error(response.Message);
        }
      },
      (error: any) => {
        this.showLoader = false;
      }
    );

    console.log("this.totalData", this.totalData);

    // this.loadData()

  }


  checkZipZeros(str: any) {
    if (str && str.length) {
      str[0] = str[0].replace(', 00000', '');
      str[0] = str[0].replace(', 0000', '');
    }
    return str;

  }

  openEditCommute(): void {
    // this.staticAuditLogAPI('92', '');
    // this.isMobile = (window.innerWidth < 990) ? true : false;
    this.editCommuteObj.startingLocation = this.myForm.value.where;

    const dialogRef = this.dialog.open(EditCommuteComponent, {
      // height: 'calc(40%)',
      height: this.isMobile ? 'calc(100%)' : '',
      width: this.isMobile ? 'calc(100%)' : 'calc(39%)',
      maxWidth: this.isMobile ? '100vw' : '',
      data: { commuteData: this.editCommuteObj },
      panelClass: 'filter-class'
      // hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.candData = result;
        console.log(result);
        this.editCommuteObj = result;
        // this.userAddress = result.startingLocation ? result.startingLocation : '';
        this.userLatitude = result.latitude ? result.latitude : '';
        this.userLongitude = result.langitude ? result.langitude : '';
        // this.myForm.value.where = this.userAddress;
        this.myForm.patchValue({
          where: result.startingLocation ? result.startingLocation : ''
        });
        console.log("editCommuteObj", this.editCommuteObj)
        this.totalData = [];
        this.jobsearch();
      }
      // console.log("editCommuteResult", result);

    });
  }

  checkDaysDiff(dateObj: any) {
    let date1 = new Date(dateObj);
    let date2 = new Date();
    // console.log(new Date(dateObj * 1000).toISOString());
    // console.log(((date1.getMonth() > 8) ? (date1.getMonth() + 1) : ('0' + (date1.getMonth() + 1))) + '/' + ((date1.getDate() > 9) ? date1.getDate() : ('0' + date1.getDate())) + '/' + date1.getFullYear());
    // return 3;

    // To calculate the time difference of two dates
    let difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    let difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
    let gapDays = (Math.round(difference_In_Days));
    let finalStr = "";
    if (gapDays == 0) {
      finalStr = 'Today'
    } else if (gapDays == 1) {
      finalStr = gapDays + 'day ago'
    } else if (gapDays >= 2 && gapDays <= 10) {
      finalStr = gapDays + ' days ago'
    } else {
      finalStr = (((date1.getMonth() > 8) ? (date1.getMonth() + 1) : ('0' + (date1.getMonth() + 1))) + '/' + ((date1.getDate() > 9) ? date1.getDate() : ('0' + date1.getDate())) + '/' + date1.getFullYear());
      // finslStr = new Date(date1,'MM/dd/yyyy'); //(job.job_.postingUpdateTime_.seconds_ * 1000 | date:'MM/dd/yyyy')
    }
    return finalStr;

  }

  applyForJob(str: any): void {
    let arry = str.name_.split("/");
    let finalStr = (arry[arry.length - 1]);
    localStorage.setItem('totalData', JSON.stringify(this.totalData));
    localStorage.setItem('what', this.myForm.value.control);
    localStorage.setItem('where', this.myForm.value.where);
    localStorage.setItem('commutFilter', JSON.stringify(this.editCommuteObj));
    localStorage.setItem('filters', JSON.stringify(this.filterObject));

    // localStorage.setItem('totalData',JSON.stringify(this.totalData));
    this.router.navigate(['/apply-jobs'], {
      queryParams: { jobid: finalStr },
    });
    // this.router.navigate(['/thanks-for-applying']);
  }

  showJobDesc(indx: any) {
    this.selectedRecord = this.totalData[indx];
    this.showDetailDescription = this.isMobile ? !this.showDetailDescription : false;
  }

  @ViewChild('fromFindJobs') fromFindJobs: ElementRef | undefined;
  findJobs() {
    // console.log(this.myForm.value.where);
    if (this.myForm.value.control == '' && this.myForm.value.where == '') {
      this.toastr.error('Enter a job title or location to start a search');
      return;
    }
    this.totalData = [];
    this.jobsearch();

    const containerElement = this.fromFindJobs?.nativeElement;

    containerElement.scrollIntoView({ behavior: 'smooth' });

  }


  onScroll = () => {
    this.currentPage++;
    // this.appendData();
    if (this.totalSize > this.totalData.length) {
      this.jobsearch();

    }
  }

  handleAddressChange(address: any) {
    this.userAddress = '';
    this.userLatitude = address.geometry.location.lat()
    this.userLongitude = address.geometry.location.lng()
    this.myForm.patchValue({
      where: address.formatted_address
    });
    this.whereFilter?.nativeElement.focus();

  }

  clearAddress() {
    const whereLocationControl = this.myForm.get('where');
    if (whereLocationControl) {
      whereLocationControl.setValue('');
    }
    this.whereFilter?.nativeElement.focus()
  }

  clickWhatClear() {
    const whatTitleControl = this.myForm.get('control');
    if (whatTitleControl) {
      whatTitleControl.setValue('');
    }
  }

  searchTitle() {
    console.log(this.myForm.value.control);
    let dataToPass = {
      "query": this.myForm.value.control
    }


    this.userService.autocomplete(dataToPass).subscribe(
      (response: any) => {
        console.log(response)
        this.filteredStreets = response.list.filter((option: any) => option.title.toLowerCase());;
        // debugger
      },
      (error: any) => { }
    );

  }

  getJobs(type: any) {
    this.errorTxt = 'No Jobs Found';
    this.searched = false;
    this.selectedJob = '';
    this.jobsList = [];

    if (type == 'keyWords') {
      this.staticAuditLogAPI('104', '');
    }
    if (type == 'location') {
      this.staticAuditLogAPI('105', '');
    }
    if (type == 'jobtype') {
      this.staticAuditLogAPI('106', '');
    }
    if (type == 'payrate') {
      this.staticAuditLogAPI('107', '');
    }

    let dataToPass = {
      keyWords: this.jobForm.value.keyWords,
      location:
        this.jobForm.value.location != '0' ? this.jobForm.value.location : '',
      jobType:
        this.jobForm.value.jobType != '0' ? this.jobForm.value.jobType : '',
      hours: this.jobForm.value.hours != '0' ? this.jobForm.value.hours : '',
      payRate:
        this.jobForm.value.payRate != '0' ? this.jobForm.value.payRate : '',
      next: '0',
      userId: Number(localStorage.getItem('userId')),
    };
    this.showSpinner = true;
    this.userService.getJobsSearchList(dataToPass).subscribe(
      (response: any) => {
        this.showSpinner = false;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Status) {
          console.log(response);

          this.searched = true;
          if (response.Match.length) {
            response.Match.forEach((el: any) => {
              el.applied = false;
              el.date = this.userService.getDateFormat(el.date);
              el.description = this.rj.removeJunk(el.description);
              el.descShort = this.rj.removeJunk(
                el.description.replace(/\r\n/g, ' ').replace(/<br \/>/g, ' ')
              );
              el.payrange1 = el.payrange;
              // if (el.payrange.includes('-')) {
              //   if (el.payrange.split('-')[0]) {
              //     el.payrange1 = parseFloat(el.payrange.split('-')[0]).toFixed(
              //       2
              //     );
              //     el.payrange1 = el.payrange1 != '0.00' ? el.payrange1 : '';
              //   }
              //   if (el.payrange.split('-')[1]) {
              //     el.payrange2 = parseFloat(el.payrange.split('-')[1]).toFixed(
              //       2
              //     );
              //     el.payrange2 = el.payrange2 != '0.00' ? el.payrange2 : '';
              //   }
              //   el.payrange = '';
              // }
            });
            this.selectedIndex = 0;
            this.selectedJob = response.Match[0];

            this.jobsAppliedList.forEach((jobApp) => {
              response.Match.forEach((el: any) => {
                if (jobApp.accuickJobId == Number(el.jobid)) {
                  el.applied = true;
                }
              });
            });
          }
          this.jobsList = response.Match;
        }
      },
      (error) => { }
    );
  }

  removeTags(myStr: string) {
    if ((myStr === null) || (myStr === ''))
      return false;
    myStr = myStr.replace(/\n/g, '');
    myStr = (myStr.replace(/\n/g, '')).replace(/style=".*?"/mg, '');
    myStr = myStr.replace(/style=.*?>/mg, '>');
    myStr = myStr.replace(/class=".*?"/mg, '');
    myStr = myStr.replace(/class=.*?>/mg, '>');
    return myStr;
  }

  clickJobsEvent() {
    this.staticAuditLogAPI('102', '');
    this.jobsTab = this.jobsTab;
  }

  scrollCallback(ev: Event) {
    var targetEle = ev.target as HTMLInputElement;
    if (targetEle.scrollTop < 1) {
      this.isassessSectionScrolled = false;
    } else {
      this.isassessSectionScrolled = true;
    }
  }

  getJobsApplied(type: any) {
    this.searched = false;
    this.showSpinner = true;
    this.userService.getJobsApplied().subscribe(
      (response: any) => {
        this.showSpinner = false;
        this.searched = true;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Success) {
          // response = JSON.parse(response);

          console.log('Jobs Applied');
          if (type) {
            this.staticAuditLogAPI('108', '');
          }
          console.log(response);
          if (response.Jobs.length) {
            response.Jobs.forEach((jobApp: any) => {
              jobApp.appliedDate = this.userService.getDateFormat(
                jobApp.appliedDate
              );
              this.jobsList.forEach((el) => {
                if (jobApp.accuickJobId == Number(el.jobid)) {
                  el.applied = true;
                }
              });
              jobApp.city = jobApp.city
                ? this.auditlogService.decryptAES(jobApp.city)
                : '';
              jobApp.clientName = jobApp.clientName
                ? this.auditlogService.decryptAES(jobApp.clientName)
                : '';
              jobApp.jobTitle = jobApp.jobTitle
                ? this.auditlogService.decryptAES(jobApp.jobTitle)
                : '';
              jobApp.state = jobApp.state
                ? this.auditlogService.decryptAES(jobApp.state)
                : '';
              jobApp.zipcode = jobApp.zipcode
                ? this.auditlogService.decryptAES(jobApp.zipcode)
                : '';
              jobApp.payRate = jobApp.payRate
                ? this.auditlogService.decryptAES(jobApp.payRate)
                : '';
              jobApp.jobType = jobApp.jobType
                ? this.auditlogService.decryptAES(jobApp.jobType)
                : '';
              jobApp.description = jobApp.description
                ? this.auditlogService.decryptAES(jobApp.description)
                : '';
            });
          }
          this.jobsAppliedList = response.Jobs;
        }
      },
      (error) => { }
    );
  }
  getRecommendJobs() {
    this.searched = false;
    this.showSpinner = true;
    let jobId = localStorage.getItem('mailJobId')
      ? localStorage.getItem('mailJobId')
      : 0;
    this.userService.getRecommendedJobs(jobId).subscribe(
      (response: any) => {
        this.showSpinner = false;
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Success) {
          // response = JSON.parse(response);

          console.log(response);

          if (response.recommendedJobs.length) {
            if (localStorage.getItem('mailJobId')) {
              let locVal: string | any = localStorage.getItem('mailJobId');
              let flexTempObj = response.recommendedJobs.filter(function (
                obj: any
              ) {
                return obj.jobid == locVal;
              });
              if (flexTempObj && flexTempObj.length) {
                this.selectedJob = flexTempObj[0];
              } else {
                this.selectedJob = response.recommendedJobs[0];
              }
              localStorage.removeItem('mailJobId');
            } else {
              this.selectedJob = response.recommendedJobs[0];
            }
            // this.candData.flexibilityPref = (flexTempObj.length) ? flexTempObj[0].lookupValue : '';

            // let index = response.recommendedJobs.findIndex(x => x.jobid === "Skeet");
            // console.log(flexTempObj);
            // this.assessmentsAry
            this.assessmentsAry = this.selectedJob.requiredAssessments; //(this.selectedJob.assessment && this.selectedJob.assessment.length) ? this.selectedJob.assessment.split(",") : [];
            // console.log(assessmentsAry);
            // if((assessRequiredAry && assessRequiredAry.length)){
            //     assessRequiredAry.forEach((el: any) => {
            //       console.log(el);
            //     });

            // }

            this.selectedIndex = 0;
            response.recommendedJobs.forEach((el: any) => {
              el.date = this.userService.getDateFormat(el.date);
              el.applied = false;
              el.description = this.rj.removeJunk(el.description);
              el.descShort = this.rj.removeJunk(
                el.description.replace(/\r\n/g, ' ').replace(/<br \/>/g, ' ')
              );
              el.payrange1 = el.payrange;
              // if (el.payrange.includes('-')) {
              //   if (el.payrange.split('-')[0]) {
              //     el.payrange1 = parseFloat(el.payrange.split('-')[0]).toFixed(
              //       2
              //     );
              //     el.payrange1 = el.payrange1 != '0.00' ? el.payrange1 : '';
              //   }
              //   if (el.payrange.split('-')[1]) {
              //     el.payrange2 = parseFloat(el.payrange.split('-')[1]).toFixed(
              //       2
              //     );
              //     el.payrange2 = el.payrange2 != '0.00' ? el.payrange2 : '';
              //   }
              //   el.payrange = '';
              // }
            });
          }
          this.jobsList = response.recommendedJobs;
          var myob = this.selectedJob.jobid;

          var selectedIndexId = this.jobsList.findIndex(function (obj: any) {
            // console.log(obj.jobid);
            return obj.jobid == myob;
          });
          var removedItem = this.jobsList.splice(selectedIndexId, 1);
          console.log(removedItem);

          this.jobsList.unshift(removedItem[0]);

          if (this.isMobile) {
            if (this.jobIdToLoad) {
              this.selectJob(0);
            }
          }
          this.searched = true;
          this.getJobsApplied(false);
        }
      },
      (error) => { }
    );
  }

  getcategorylist() {
    // console.log(this.loginForm.value);
    this.userService.getcategorylist().subscribe(
      (response: any) => {
        if (response && response.Success) {
          this.userService.categoryList = response.CategoryList;
          this.loadObjects();
        }
      },
      (error) => { }
    );
  }

  loadObjects() {
    let curEmpStatusobj = this.userService.categoryList.filter(function (
      obj: any
    ) {
      return obj.categoryID == 10010;
    });
    this.jobtypes =
      curEmpStatusobj && curEmpStatusobj.length
        ? curEmpStatusobj[0].lookupsList
        : [];
  }
  selectJob(i: number) {
    this.selectedJob = '';
    this.selectedJob = this.jobsList[i];

    const job_data = JSON.parse(localStorage.getItem('jobData') || '{}');

    this.assessmentsAry = this.selectedJob.requiredAssessments; //(this.selectedJob.assessment && this.selectedJob.assessment.length) ? this.selectedJob.assessment.split(",") : [];
    this.selectedIndex = i;
    if (this.isMobile) {
      const dialogRef = this.dialog.open(ShowJobComponent, {
        height: '99%',
        // width: '85%',
        maxWidth: '800px',
        data: {
          job_url: job_data.job_url,
          selectedJob: this.selectedJob,
          pageName: 'jobs',
        },
        panelClass: 'jobdetail-dialog-container',
        // hasBackdrop: false,
      });

      dialogRef.afterClosed().subscribe((result: { status: Boolean }) => {
        if (result) {
          this.jobsList[i].applied = true;
        }
        console.log(result);
      });
    } else {
      let tedt = this.jobDetail?.nativeElement;
      tedt.scrollTop = 0;
    }
  }
  applyJob() {
    let payrate = '';
    if (this.selectedJob.payrate) {
      payrate = this.selectedJob.payrate;
    } else {
      payrate = this.selectedJob.payrange;
      // if (this.selectedJob.payrange1) {
      //   payrate = this.selectedJob.payrange1;
      // }
      // if (this.selectedJob.payrange2) {
      //   payrate += this.selectedJob.payrange2;
      // }
    }
    let dataToPass = {
      accuickJobId: this.selectedJob.jobid,
      userId: Number(localStorage.getItem('userId')),
      jobTitle: this.auditlogService.encryptAES(this.selectedJob.jobtitle),
      clientName: this.auditlogService.encryptAES(this.selectedJob.compname),
      city: this.auditlogService.encryptAES(this.selectedJob.city),
      state: this.auditlogService.encryptAES(this.selectedJob.state),
      zipcode: this.auditlogService.encryptAES(this.selectedJob.zipcode),
      payRate: this.auditlogService.encryptAES(payrate),
      jobType: this.auditlogService.encryptAES(this.selectedJob.jobtype),
      description: this.auditlogService.encryptAES(
        this.selectedJob.description
      ),
      source: 'cxninja',
    };
    this.showSpinner = true;
    this.userService.applyJob(dataToPass).subscribe(
      (response: any) => {
        this.showSpinner = false;
        var tokenExist = true;
        if (!localStorage.getItem('userToken')) {
          const pageUrl = JSON.parse(localStorage.getItem('jobData') || '{}');
          // this.toastr.error(response.Message);
          this.toastr.info(response.Message);

          this.router.navigate(
            [pageUrl && pageUrl.job_url ? pageUrl.job_url : 'apply-jobs'],
            { queryParams: { jobid: this.selectedJob.jobid } }
          );
          return;
        }
        if (response && response.Status == 401) {
          this.toastr.error(response.Message);
        }
        if (response && response.Status) {
          if (response.Error) {
            this.toastr.error(response.Message);
          } else {
            this.jobsList[this.selectedIndex].applied = true;
            this.selectedJob.applied = true;
            if (response.Message.includes('already')) {
              this.toastr.info(response.Message);
            } else {
              this.toastr.success(response.Message);
            }
          }
          console.log(response);
        }
      },
      (error) => { }
    );
  }

  ngOnInit(): void {


    

    this.mapsAPILoader.load().then(() => {
      this.isApiLoaded = true
    })

    this.actRoute.queryParams.subscribe((params) => {
      // this.emailid = params.emailid ? params.emailid : '';
      this.jobIdFromMail = params.email ? params.email : '';
      if (this.jobIdFromMail) {
        this.jobIdFromMail = this.jobIdFromMail;
        localStorage.setItem('mailJobId', params.jobId);
        localStorage.setItem('emailFromMail', params.email);
      }
      if (params.jobId) {
        this.jobIdToLoad = params.jobId ? params.jobId : '';
        localStorage.setItem('mailJobId', params.jobId);
      }
    });

    // if(this.actRoute.snapshot.params.id){
    //   this.jobIdFromMail = this.actRoute.snapshot.params.id;
    //   localStorage.setItem('mailJobId', this.actRoute.snapshot.params.id);
    //   localStorage.setItem('emailFromMail', this.actRoute.snapshot.params.emailid);
    // }

    if (!this.userService.isUserLoggedIn()) {
      this.router.navigate(['/login']);
      Emitters.authEmitter.emit(false);
      return;
    } else {
      // localStorage.removeItem('mailJobId');
      // localStorage.removeItem('emailFromMail');
      this.staticAuditLogAPI('102', '');
      Emitters.authEmitter.emit(true);
    }

    // this.getRecommendJobs();

    // this.jobsearch();
    if (localStorage.getItem("showPrevRecord") == "true") {
      localStorage.removeItem("showPrevRecord");
      let cacheData = JSON.parse(localStorage.getItem("totalData") || '');
      // this.totalData = cacheData;
      if (cacheData && cacheData.length) {
        this.totalData = cacheData;
        this.selectedRecord = this.totalData[0];
        this.totalSize = this.totalData.length;

      }


      this.myForm.patchValue({
        control: localStorage.getItem('what'),
        where: localStorage.getItem('where')
      });
      this.editCommuteObj = JSON.parse(localStorage.getItem("commutFilter") || '');
      this.filterObject = JSON.parse(localStorage.getItem("filters") || '');


      localStorage.removeItem('what');
      localStorage.removeItem('where');
      localStorage.removeItem('commutFilter');
      localStorage.removeItem('filters');
    } else {
      this.userService.getIpAddress().subscribe(
        (response: any) => {
  
          console.log("response curre", response)
          this.myForm.patchValue({
            where: response.city + ',' + response.region
  
          });
          this.userAddress = response.city + ',' + response.region;
          this.jobsearch();
  
        },
        (error: any) => { }
      );

    }
    // this.isMobile = (window.innerWidth < 720) ? true : false;
    this.isMobile = window.innerWidth < 720 ? true : false;

    // if (this.userService.categoryList) {
    //   this.loadObjects();
    // } else {
    //   this.getcategorylist();
    // }
  }

  getAssessmentName(assessmentname: any) {
    // console.log(assessmentname);
    let obj = this.selectedJob.requiredAssessments.find((assessments: any) => {
      console.log(assessments.assessmentsId + '===' + assessmentname.trim());
      console.log(assessments.assessmentsId === assessmentname.trim());
      if (assessments.assessmentsId === assessmentname.trim()) return true;
      else return false;
    });
    console.log(obj);
    return obj;
  }

  staticAuditLogAPI(actionId: string, jsonString: string) {
    let num: any = localStorage.getItem('userId'); //number
    //let stringForm = num.toString();
    this.auditObj.actionId = actionId;
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
    );
  }

  
  closeJobDetail() {
    this.showDetailDescription = this.isMobile ? !this.showDetailDescription : false;

  }

  removeJobTileFilter(item: string, indx: any) {
    let finalStr = this.filterObject.jobType.replace(item, '');
    finalStr = finalStr.replace(",,", ",");
    if (finalStr.indexOf(",") == 0) {
      finalStr = finalStr.substring(1);
    }
    if (finalStr[finalStr.length - 1] == ',') {
      finalStr = finalStr.slice(0, -1);
    }

    this.filterObject.jobType = finalStr;
    this.jobsearch()
  }
  applyJobFromMobile(str: any): void {
    let arry = str.name_.split("/");
    let finalStr = (arry[arry.length - 1]);
    this.showDetailDescription = this.isMobile ? !this.showDetailDescription : false;

    localStorage.setItem('totalData', JSON.stringify(this.totalData));
    localStorage.setItem('what', this.myForm.value.control);
    localStorage.setItem('where', this.myForm.value.where);
    localStorage.setItem('commutFilter', JSON.stringify(this.editCommuteObj));
    localStorage.setItem('filters', JSON.stringify(this.filterObject));

    this.router.navigate(['/apply-jobs'], {
      queryParams: { jobid: finalStr },
    });
    // this.router.navigate(['/thanks-for-applying']);
  }
}
