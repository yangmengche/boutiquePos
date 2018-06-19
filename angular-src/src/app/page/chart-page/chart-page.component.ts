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
    }, {
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
    }, {
      'type': 'month'
      , 'name': '月'
    }, {
      'type': 'year',
      'name': '年'
    }, {
      'type': 'dayOfWeek',
      'name': '星期'
    }]
  public barData: any[];
  public pieData: {
    'supplier': any[],
    'category': any[]
  };

  // options
  public barSetting = {
    view: [700, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: '日期',
    showYAxisLabel: true,
    yAxisLabel: 'NT$'
  }
  public pieSetting = {
    view: [500, 500],
    legend: false,
    explodeSlices: false,
    labels: true,
    doughnut: false,
    gradient: true,
    isHori: true
  }

  public pageSetting = {
    formatType: this.formats[0].type,
    group: this.groups[0].type,
    from: null,
    to: null
  }

  colorScheme = {
    domain: [
      '#FAC51D', '#66BD6D', '#FAA026', '#29BB9C', '#E96B56', '#55ACD2', '#B7332F', '#2C83C9', '#9166B8', '#92E7E8'
    ]
  };
  constructor(
    private chartSrv: ChartService,
  ) { }

  ngOnInit() {
    this.barData = [];
    this.pieData = {
      'supplier': [],
      'category': []
    }

    this.monthHistogram();
    this.queryPieData('supplier');
    this.queryPieData('category');
    let width = window.innerWidth * 1
    this.setChartSize(width);
  }

  private setChartSize(width) {
    this.barSetting.view[0] = width;
    this.barSetting.view[1] = this.barSetting.view[0] * 0.56;
    if (width > 500) {
      this.pieSetting.view[0] = width / 2;
      this.pieSetting.view[1] = width / 2;
      this.pieSetting.isHori = true;
    } else {
      this.pieSetting.view[0] = width;
      this.pieSetting.view[1] = width;
      this.pieSetting.isHori = false;
    }
  }

  onSelect(event) {
    console.log(event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let width = window.innerWidth * 1
    this.setChartSize(width);
  }

  public onFormatChanged() {
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }

  private formatBarData(formatType, res) {
    let data = [];

    for (let i in res) {
      let d = [], tmpl = '';
      let item = {
        "name": '',
        "series": []
      };
      if (res[i]._id.dayOfWeek) {
        item.name = res[i]._id.dayOfWeek;
      } else {
        if (res[i]._id.year) {
          d.push(res[i]._id.year);
          tmpl += ('Y');
        }
        if (res[i]._id.month) {
          d.push(res[i]._id.month);
          tmpl += ('/M');
        }
        if (res[i]._id.date) {
          d.push(res[i]._id.date);
          tmpl += ('/D');
        }
        item.name = moment(d).format(tmpl);
      }
      switch (formatType) {
        case 'revenue':
          item.series.push(
            {
              "name": "營收",
              "value": res[i].revenue
            });
          break;
        case 'profit':
          item.series.push(
            {
              "name": "毛利",
              "value": res[i].revenue - res[i].cost
            });
          break;
        case 'profit-cost':
          item.series.push(
            {
              "name": "成本",
              "value": res[i].cost
            },
            {
              "name": "毛利",
              "value": res[i].revenue - res[i].cost
            });
          break;
      }
      data.push(item);
    }
    return data;
  }
  public weekHistogram() {
    this.pageSetting.from = moment().startOf('week').toDate();
    this.pageSetting.to = moment().endOf('week').toDate();
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }

  public monthHistogram() {
    this.pageSetting.from = moment().startOf('month').toDate();
    this.pageSetting.to = moment().endOf('month').toDate();
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }

  public yearHistogram() {
    this.pageSetting.from = moment().startOf('year').toDate();
    this.pageSetting.to = moment().endOf('year').toDate();
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }

  public onQueryByTimeSlot() {
    if (moment.isMoment(this.pageSetting.from)) {
      this.pageSetting.from = this.pageSetting.from.toDate();
    }
    if (moment.isMoment(this.pageSetting.to)) {
      this.pageSetting.to = this.pageSetting.to.toDate();
    }
    this.queryHistogram(this.pageSetting.from, this.pageSetting.to, this.pageSetting.group, this.pageSetting.formatType);
  }

  private queryHistogram(from, to, group, formatType) {
    this.queryPieData('supplier');
    this.queryPieData('category');
    this.chartSrv.getHistogramData(from, to, group).subscribe((res) => {
      // notify data changed to charts
      this.barData = this.formatBarData(formatType, res);
    });
  }

  public formatPieData(group, res) {
    let data = { 'revenue': [], 'profit': [], 'quantity': [] };
    let totalRevenue = 0, totalCost = 0, totalQuantity = 0;
    for (let i in res) {
      totalRevenue += res[i].revenue;
      totalCost += res[i].cost;
      totalQuantity += res[i].quantity;
    }
    for (let i in res) {
      data.revenue.push({
        'name': res[i]._id + ' (' + Math.round(res[i].revenue / totalRevenue * 10000) / 100 + '%)',
        'value': res[i].revenue,
        // 'percentage': Math.round(res[i].revenue / totalRevenue * 10000) / 100
      });
      data.profit.push({
        'name': res[i]._id + ' (' + Math.round((res[i].revenue - res[i].cost) / (totalRevenue - totalCost) * 10000) / 100 + '%)',
        'value': res[i].revenue - res[i].cost,
        // 'percentage': Math.round((res[i].revenue - res[i].cost) / (totalRevenue - totalCost) * 10000) / 100
      });
      data.quantity.push({
        'name': res[i]._id + ' (' + Math.round(res[i].quantity / totalQuantity * 10000) / 100 + '%)',
        'value': res[i].quantity,
        // 'percentage': Math.round(res[i].quantity / totalQuantity * 10000) / 100
      });
    }
    return data;
  }


  public queryPieData(group) {
    this.chartSrv.getPieData(this.pageSetting.from, this.pageSetting.to, group).subscribe((res) => {
      this.pieData[group] = this.formatPieData(group, res);
    });
  }

  public tooltipText(_a) {
    var data = _a.data;
    var label = data.name;
    var val = data.value.toLocaleString();
    let percentage = Math.round(0.15810881 * (_a.endAngle - _a.startAngle) * 10000) / 100;
    console.log(JSON.stringify(_a));
    return "\n      <span class=\"tooltip-label\">" + label + "</span>\n      <span class=\"tooltip-val\">" + val + '(' + percentage + ')' + "</span>\n    ";
  }
}

