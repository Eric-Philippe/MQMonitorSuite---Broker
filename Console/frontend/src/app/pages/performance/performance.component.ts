import { Component, OnInit } from '@angular/core';
import { ImportsModule } from 'src/app/imports';
import { PageTemplateComponent } from '../page/page.component';
import { BrokerLogsService } from '@service/BrokerLogs.service';
import { BrokerLog } from 'src/app/models/BrokerLog';
import { LineMsgCountComponent } from 'src/app/components/chart/linemsgcount/linemsgcount.component';
import { PieMsgStatusComponent } from 'src/app/components/chart/piemsgstatus/piemsgstatus.component';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Component({
  standalone: true,
  templateUrl: './performance.component.html',
  imports: [ImportsModule, PageTemplateComponent, LineMsgCountComponent, PieMsgStatusComponent],
  providers: [BrokerLogsService],
})
export class PerformanceComponent implements OnInit {
  brokerLogs: BrokerLog[] = [];
  brokerLogsToday: BrokerLog[] = [];
  brokerLogsLastHour: BrokerLog[] = [];
  data: any;
  options: any;

  constructor(private brokerLogsService: BrokerLogsService) {}

  async ngOnInit() {
    this.brokerLogs = await (
      await this.brokerLogsService.getAllBrokerLogs()
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.brokerLogsToday = this.brokerLogs.filter(
      (log) =>
        new Date(log.date).getDate() === new Date().getDate() &&
        new Date(log.date).getMonth() === new Date().getMonth() &&
        new Date(log.date).getFullYear() === new Date().getFullYear()
    );
  }
}
