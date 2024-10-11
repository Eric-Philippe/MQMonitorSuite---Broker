import { Component, Input, OnInit } from '@angular/core';

import { ImportsModule } from 'src/app/imports';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { BrokerAppService } from '../../../service/BrokerApp.service';
import { ServiceStatus } from '../../models/BrokerStatus';
import { ServiceStatusEnum } from '../../models/BrokerStatusEnum';
import { REFRESH_TIME } from 'src/conf/env';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ImportsModule, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [BrokerAppService],
})
export class HeaderComponent implements OnInit {
  public brokerStatus: ServiceStatus = {
    latency: 0,
    status: ServiceStatusEnum.UP,
  };

  public pearApiStatus: ServiceStatus = {
    latency: 0,
    status: ServiceStatusEnum.UP,
  };

  @Input() isBrokerUp: boolean = true;

  constructor(private brokerStatusService: BrokerAppService) {}

  async ngOnInit() {
    this.updateStatus();
    setInterval(() => {
      this.updateStatus();
    }, REFRESH_TIME);
  }

  updateStatus() {
    this.brokerStatusService.getBrokerStatus().then((status) => {
      this.brokerStatus = status;
    });

    this.brokerStatusService.getPearAPIStatus().then((status) => {
      this.pearApiStatus = status;
    });
  }

  getHeaderColorClass(): string {
    if (this.brokerStatus.status === ServiceStatusEnum.DOWN) {
      return 'header-red';
    } else if (this.brokerStatus.latency > 125) {
      return 'header-orange';
    } else {
      return 'header-green';
    }
  }

  getStatusText(): string {
    return this.brokerStatus.status === ServiceStatusEnum.DOWN
      ? 'Broker Down'
      : 'Broker available ';
  }

  getPearAPiText(): string {
    return this.pearApiStatus.status === ServiceStatusEnum.DOWN
      ? 'PearApi Down'
      : 'PearApi available ';
  }
}
