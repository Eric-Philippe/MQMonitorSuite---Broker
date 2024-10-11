import { Component, Input, OnChanges } from '@angular/core';
import { ImportsModule } from 'src/app/imports';
import { BrokerLog } from 'src/app/models/BrokerLog';
import { BrokerLogStatus, BrokerLogStatusLabels } from 'src/app/models/BrokerLogStatus';

@Component({
  selector: 'app-performance-msgpiestatus',
  standalone: true,
  imports: [ImportsModule],
  template: `
    <div *ngIf="brokerLogs.length === 0" class="text-center text-gray-500">No data available</div>
    <p-chart type="pie" [data]="data" [options]="options" />
  `,
})
export class PieMsgStatusComponent implements OnChanges {
  @Input() brokerLogs: BrokerLog[] = [];
  data: any;
  options: any;

  async ngOnChanges() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    const statusColorMap = {
      [BrokerLogStatus.COMPLETED]: '#34d399',
      [BrokerLogStatus.RECEIVED]: '#ced8ff',
      [BrokerLogStatus.FAILED]: '#ed5e45',
      [BrokerLogStatus.RESENT_PENDING]: '#fbbf24',
      [BrokerLogStatus.RESENT_COMPLETED]: '#c084fc',
    };

    const uniqueStatuses = new Set(this.brokerLogs.map((log) => log.status));

    this.data = {
      labels: Array.from(uniqueStatuses).map((status) => BrokerLogStatusLabels.get(status)),
      datasets: [
        {
          label: 'Messages status',
          data: Array.from(uniqueStatuses).map(
            (status) => this.brokerLogs.filter((log) => log.status === status).length
          ),
          backgroundColor: Array.from(uniqueStatuses).map((status) => statusColorMap[status]),
          borderWidth: 1,
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }
}
