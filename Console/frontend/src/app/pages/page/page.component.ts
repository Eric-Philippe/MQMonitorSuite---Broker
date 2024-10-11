import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ImportsModule } from 'src/app/imports';
import { HeaderComponent } from '../../components/header/header.component';
import { BrokerAppService } from '@service/BrokerApp.service';
import { REFRESH_TIME, BROKER_ENV, BROKER_VERSION } from 'src/conf/env';

@Component({
  selector: 'app-page-template',
  standalone: true,
  template: `
    <div class="page-template">
      <app-header [isBrokerUp]="isBrokerUp"></app-header>
      <div id="title-card" class="card">
        <h1 class="text-700 text-3xl ml-5 mt-5">
          {{ page_title }}
        </h1>
        <p-tag
          class="text-xs ml-4 mb-5 small-badge"
          severity="{{ getTagSeverity() }}"
          pTooltip="Broker version: {{ BROKER_VERSION }}"
          tooltipPosition="bottom"
          style="cursor: help;"
        >
          Broker environment: {{ brokerEnv }}
        </p-tag>
      </div>
      <ng-template #contentTemplate let-data="data">
        <ng-content></ng-content>
      </ng-template>
      <ng-container
        *ngTemplateOutlet="contentTemplate; context: { data: isBrokerUp }"
      ></ng-container>
    </div>
  `,

  imports: [ImportsModule, HeaderComponent],
  providers: [BrokerAppService],
})
export class PageTemplateComponent {
  @Input() page_title: string = '';
  @Output() brokerStatusChange = new EventEmitter<boolean>();

  private brokerStatusService: BrokerAppService;
  public isBrokerUp: boolean = true;

  brokerEnv: string = BROKER_ENV;
  BROKER_VERSION: string = BROKER_VERSION;

  constructor(brokerAppService: BrokerAppService) {
    this.brokerStatusService = brokerAppService;
    this.refreshBrokerStatus();
  }

  refreshBrokerStatus() {
    this.brokerStatusService.getBrokerStatus().then((status) => {
      const newStatus = this.brokerStatusService.isUp();
      if (newStatus !== this.isBrokerUp) {
        this.isBrokerUp = newStatus;
        this.brokerStatusChange.emit(this.isBrokerUp);
      }
    });
    setTimeout(() => {
      this.refreshBrokerStatus();
    }, REFRESH_TIME);
  }

  getTagSeverity() {
    return this.brokerEnv.toLowerCase() === 'dev' ? 'secondary' : 'info';
  }
}
