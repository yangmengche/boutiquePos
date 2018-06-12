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
  public formats = [
    {
      'type': 'revenue',
      'name': '營收'
    },{
      'type': 'profit',
      'name': '毛利'
    }, {
      'type': 'profit-cost',
      'name': '毛利－成本'
    }]
  public groups = [
    {
      'type': 'dayOfMonth',
      'name': '日'
    },{
      'type': 'month'
      ,'name': '月'
    }, {
      'type': 'year',
      'name': '年'
    }, {
      'type': 'dayOfWeek',
      'name': '星期'
    }]
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

  public pageSetting = {
    formatType: this.formats[0].type,
    group: this.groups[0].type,
    from: null,
    to: null
  }
  

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };  
  constructor(
    private chartSrv: ChartService,
  ) {}

  ngOnInit() {
    this.chartData = [];
    this.monthHistogram();
  }
  onSelect(event) {
    console.log(event);
  }
    
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.view[0] = window.innerWidth < 900 ? window.innerWidth : 900;
    this.view[1] = this.view[0]*0.56;
  }

  public onFormatChanged(){
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }

  private formatData(formatType, res){
    let data = [];
    
    for(let i in res){
      let d = [], tmpl='';
      let item={
        "name":'',
        "series":[]
      };      
      if(res[i]._id.dayOfWeek){
        item.name = res[i]._id.dayOfWeek;
      }else{
        if(res[i]._id.year){
          d.push(res[i]._id.year);
          tmpl+=('Y');
        }
        if(res[i]._id.month){
          d.push(res[i]._id.month);
          tmpl+=('/M');
        }
        if(res[i]._id.date){
          d.push(res[i]._id.date);
          tmpl+=('/D');
        }
        item.name = moment(d).format(tmpl);
      }
      switch(formatType){
        case 'revenue':
          item.series.push(
            {
              "name":"營收",
              "value": res[i].revenue
            });
        break;
        case 'profit':
          item.series.push(
            {
              "name":"毛利",
              "value": res[i].revenue - res[i].cost
            });
        break;        
        case 'profit-cost':
          item.series.push(
            {
              "name":"成本",
              "value": res[i].cost
            },            
            {
              "name":"毛利",
              "value": res[i].revenue - res[i].cost
            });
        break;
      }
      data.push(item);
    }
    return data;
  }
  public weekHistogram(){
    this.pageSetting.from = moment().startOf('week').toDate();
    this.pageSetting.to = moment().endOf('week').toDate();
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }

  public monthHistogram(){
    this.pageSetting.from = moment().startOf('month').toDate();
    this.pageSetting.to = moment().endOf('month').toDate();
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }
  
  public yearHistogram(){
    this.pageSetting.from = moment().startOf('year').toDate();
    this.pageSetting.to = moment().endOf('year').toDate();
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }  

  public onQueryByTimeSlot(){
    if(moment.isMoment(this.pageSetting.from)){
      this.pageSetting.from = this.pageSetting.from.toDate();
    }
    if(moment.isMoment(this.pageSetting.to)){
      this.pageSetting.to = this.pageSetting.to.toDate();
    }
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }

  private queryHistogram(from, to, group, formatType){
    this.chartSrv.getHistogramData(from, to, group).subscribe((res)=>{
      // notify data changed to charts
      this.chartData = this.formatData(formatType, res);
    });
  }
}
