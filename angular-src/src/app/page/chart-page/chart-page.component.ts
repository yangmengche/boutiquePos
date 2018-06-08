import { Component, OnInit, HostListener } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartService } from '../../service/chart.service';
import * as moment from 'moment';

@Component({
  selector: 'app-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.css']
})
export class ChartPageComponent implements OnInit {

  public chartData: any[];
  public view: any[] = [700, 400];

  // options
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisLabel = '日期';
  public showYAxisLabel = true;
  public yAxisLabel = 'NT$';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };  
  constructor(
    private chartSrv: ChartService,
  ) {}

  ngOnInit() {
    this.chartData = [];
    this.dailyHistogram();
    // this.chartData = [
    //   {
    //     "name": "Germany",
    //     "series": [
    //       {
    //         "name": "2010",
    //         "value": 40632
    //       },
    //       {
    //         "name": "2000",
    //         "value": 36953
    //       },
    //       {
    //         "name": "1990",
    //         "value": 31476
    //       }
    //     ]
    //   }
    // ];    
  }
  onSelect(event) {
    console.log(event);
  }
    
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.view[0] = window.innerWidth < 900 ? window.innerWidth : 900;
    this.view[1] = this.view[0]*0.56;
  }

  private dailyHistogram(){
    let from = moment().startOf('month').toDate();
    let to = moment().endOf('month').toDate();    
    this.chartSrv.getHistogramData(from, to, 'monthDay').subscribe((res)=>{
      for(let i in res){
        this.chartData.push({
          "name":moment([res[i]._id.year, res[i]._id.month, res[i]._id.date]).format('Y/MM/D'),
          "series":[
            {
              "name":"營收",
              "value": res[i].revenue
            },
            {
              "name":"毛利",
              "value": res[i].revenue - res[i].cost
            },
            {
              "name":"數量",
              "value": res[i].quantity
            }                        
          ]
        });
      }
      console.log(this.chartData);
    });
  }
}
