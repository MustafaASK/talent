import { Component, OnInit } from '@angular/core';
import { AssessmentCountService } from 'src/app/shared/services/assessment-count.service';

@Component({
  selector: 'app-dashboard-left-menu',
  templateUrl: './dashboard-left-menu.component.html',
  styleUrls: ['./dashboard-left-menu.component.css']
})
export class DashboardLeftMenuComponent implements OnInit {

  constructor(
    private countChange: AssessmentCountService
  ) { }
  progressPercentage:any = 0;
  myValue: any;
  totalValue:any;
  completedAssessments:any;
  totalAssessments:any


  ngOnInit(): void {

 
    // this.completedAssessments=  (localStorage.getItem("completedAssessments")); //number
    // this.totalAssessments = (localStorage.getItem("totalAssessments")); //number
    var myValue:number = +(this.completedAssessments);
    var totalValue:number = +(this.totalAssessments);
    if(myValue > totalValue){
      myValue = totalValue;
      this.completedAssessments = this.completedAssessments;
    }
    this.progressPercentage =  parseInt(((myValue/totalValue)*100).toFixed(2));
    this.progressPercentage =  (this.progressPercentage) ? this.progressPercentage : 0;
    
    console.log(this.progressPercentage);


    this.countChange.assessmentCount.subscribe(result => {
      // console.log(result);
      this.completedAssessments = result.count;
    });
    this.countChange.assessmentTotalCount.subscribe(result => {
      // console.log(result);
      this.totalAssessments = result.total;
      this.progressPercentage =  (this.completedAssessments / this.totalAssessments) * 100;
    });






  }

}
