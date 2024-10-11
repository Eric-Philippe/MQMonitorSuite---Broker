import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImportsModule } from 'src/app/imports';
import { LogsTableComponent } from '../../components/logstable/logstable.component';
import { PageTemplateComponent } from '../page/page.component';
import { BrokerLogsService } from '@service/BrokerLogs.service';
import { MeterStatsComponent } from 'src/app/components/meterstats/meterstats.component';
import { BrokerAppService } from '@service/BrokerApp.service';
import { BrokerLog } from 'src/app/models/BrokerLog';
import { DestinationProps } from 'src/app/models/DestinationProps';
import { REFRESH_TIME } from 'src/conf/env';
import { RerouteDialogComponent } from 'src/app/components/reroutedialog/reroute-dialog.component';

@Component({
  standalone: true,
  imports: [
    ImportsModule,
    PageTemplateComponent,
    LogsTableComponent,
    MeterStatsComponent,
    RerouteDialogComponent,
  ],
  template: `
    <app-page-template
      page_title="PPF Broker Console - Dashboard"
      (brokerStatusChange)="onBrokerStatusChange($event)"
    >
      <div style="padding: 20px 100px;">
        <meterstats-component [isBrokerUp]="isBrokerUp"></meterstats-component>
        <h1 style="margin-top: 50px;"></h1>
        <logs-table
          [brokerLogs]="brokerLogs"
          [routesProperties]="routesProperties"
          [isBrokerUp]="isBrokerUp"
          [loading]="loading"
        ></logs-table>
        <app-reroute-dialog (dialogClosed)="fetchBrokerLogsData()"></app-reroute-dialog>
      </div>
    </app-page-template>
  `,
  providers: [LogsTableComponent, BrokerLogsService, BrokerAppService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() isBrokerUp: boolean = true;
  public brokerLogs: BrokerLog[] = [];
  public routesProperties: Map<String, DestinationProps> = new Map();
  public loading = true;
  private intervalId: any;
  public autoRefreshLogs: boolean = localStorage.getItem('autoRefreshLogs') != 'false';

  constructor(
    private brokerLogsService: BrokerLogsService,
    private brokerAppService: BrokerAppService
  ) {}

  async ngOnInit() {
    this.fetchBrokerLogsData();
    this.intervalId = setInterval(() => this.fetchBrokerLogsData(), REFRESH_TIME);
  }

  async fetchBrokerLogsData() {
    try {
      await this.brokerAppService.getBrokerStatus();
      this.brokerLogs = await this.brokerLogsService.getAllBrokerLogs();
      this.brokerLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.routesProperties = await this.brokerAppService.getBrokerRoutingPropertiesCleaned();
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

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
