import { Component, Input, OnInit } from '@angular/core';

import { ImportsModule } from 'src/app/imports';
import { LogsTableComponent } from '../../components/logstable/logstable.component';
import { PageTemplateComponent } from '../page/page.component';
import { BrokerLogsService } from '@service/BrokerLogs.service';
import { MeterStatsComponent } from 'src/app/components/meterstats/meterstats.component';
import { BrokerAppService } from '@service/BrokerApp.service';
import { BrokerLog } from 'src/app/models/BrokerLog';
import { REFRESH_TIME } from 'src/conf/env';

@Component({
  standalone: true,
  imports: [ImportsModule, PageTemplateComponent, LogsTableComponent, MeterStatsComponent],
  template: `
    <app-page-template
      page_title="PPF Broker Console - Alerts"
      (brokerStatusChange)="onBrokerStatusChange($event)"
    >
      <div style="padding: 20px 100px;">
        <h6 style="margin-top: 50px;">
          Here you'll find all the recent logs that stayed in failed status during the last three
          weeks
        </h6>
        <logs-table
          [brokerLogs]="brokerLogs"
          [isBrokerUp]="isBrokerUp"
          [loading]="loading"
        ></logs-table>
      </div>
    </app-page-template>
  `,
  providers: [LogsTableComponent, BrokerLogsService, BrokerAppService],
})
export class AlertsComponent implements OnInit {
  @Input() isBrokerUp: boolean = true;
  public brokerLogs: BrokerLog[] = [];
  public loading = true;
  private intervalId: any;

  public autoRefreshLogs: boolean = localStorage.getItem('autoRefreshLogs') != 'false';

  constructor(
    private brokerLogsService: BrokerLogsService,
    private brokerAppService: BrokerAppService
  ) {}

  async ngOnInit() {
    this.fetchBrokerLogsData();
    this.intervalId = setInterval(() => {
      this.fetchBrokerLogsData();
    }, REFRESH_TIME);
  }

  async fetchBrokerLogsData() {
    try {
      await this.brokerAppService.getBrokerStatus();
      this.brokerLogs = await this.brokerLogsService.getRecentErrorBrokerLogs();

      if (!this.autoRefreshLogs) clearInterval(this.intervalId);
    } catch (error) {
      console.log('Broker is Down /!\\');
    }
    this.loading = false;
  }

  onBrokerStatusChange(newStatus: boolean) {
    this.isBrokerUp = newStatus;
    this.fetchBrokerLogsData();
  }
}
