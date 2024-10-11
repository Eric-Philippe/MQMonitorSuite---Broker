import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BrokerLogsService } from '@service/BrokerLogs.service';
import { BrokerLogStatus } from 'src/app/models/BrokerLogStatus';
import { ImportsModule } from 'src/app/imports';

const defaultValues = [
  {
    label: 'Success',
    color1: '#34d399',
    color2: '#fbbf24',
    value: 0,
    icon: 'pi pi-check-circle',
  },
  {
    label: 'Pending',
    color1: '#fbbf24',
    value: 0,
    icon: 'pi pi-clock',
  },
  {
    label: 'Error',
    color1: '#ed5e45',
    value: 0,
    icon: 'pi pi-exclamation-circle',
  },
  {
    label: 'Resent pending',
    color1: '#fbbf24',
    value: 0,
    icon: 'pi pi-clock',
  },
  {
    label: 'Resent success',
    color1: '#c084fc',
    value: 0,
    icon: 'pi pi-verified',
  },
];

@Component({
  selector: 'meterstats-component',
  templateUrl: './meterstats.component.html',
  standalone: true,
  imports: [ImportsModule],
})
export class MeterStatsComponent implements OnInit, OnChanges {
  @Input() isBrokerUp: boolean = true;

  public value = defaultValues;

  public total = 0;

  constructor(private brokerLogs: BrokerLogsService) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }

  loadData(): void {
    if (!this.isBrokerUp) {
      this.value = defaultValues;
    } else {
      this.brokerLogs.getAllBrokerLogs().then((logs) => {
        this.total = logs.length;

        const calculPercentage = (status: BrokerLogStatus) => {
          return Math.round(
            (logs.filter((log) => log.status === status).length / this.total) * 100
          );
        };

        this.value = [
          {
            label: 'Success',
            color1: '#34d399',
            value: calculPercentage(BrokerLogStatus.COMPLETED),
            icon: 'pi pi-check-circle',
          },
          {
            label: 'Pending',
            color1: '#ced8ff',
            value: calculPercentage(BrokerLogStatus.RECEIVED),
            icon: 'pi pi-clock',
          },
          {
            label: 'Error',
            color1: '#ed5e45',
            value: calculPercentage(BrokerLogStatus.FAILED),
            icon: 'pi pi-exclamation-circle',
          },
          {
            label: 'Resent pending',
            color1: '#fbbf24',
            value: calculPercentage(BrokerLogStatus.RESENT_PENDING),
            icon: 'pi pi-clock',
          },
          {
            label: 'Resent success',
            color1: '#c084fc',
            value: calculPercentage(BrokerLogStatus.RESENT_COMPLETED),
            icon: 'pi pi-verified',
          },
        ];

        // Remove any NaN value by 0
        this.value = this.value.map((v) => {
          return {
            ...v,
            value: isNaN(v.value) ? 0 : v.value,
          };
        });
      });
    }
  }
}
