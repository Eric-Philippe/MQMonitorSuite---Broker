import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ImportsModule } from 'src/app/imports';
import { BrokerLog } from 'src/app/models/BrokerLog';
import { BrokerLogStatus } from 'src/app/models/BrokerLogStatus';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Component({
  selector: 'app-performance-msgcount',
  standalone: true,
  imports: [ImportsModule],
  template: ` <p-chart type="line" [data]="data" [options]="options" /> `,
})
export class LineMsgCountComponent implements OnChanges {
  @Input() brokerLogs: BrokerLog[] = [];
  data: any;
  options: any;

  async ngOnChanges() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Format labels to include both date and month
    this.data = {
      labels: this.brokerLogs
        .map((log) => {
          const date = new Date(log.date);
          return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
        })
        .filter((value, index, self) => self.indexOf(value) === index),
      datasets: [
        {
          label: 'Messages',
          data: this.brokerLogs
            .map((log) => new Date(log.date).getDate())
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(
              (day) => this.brokerLogs.filter((log) => new Date(log.date).getDate() === day).length
            ),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0,
        },
        {
          label: 'Failed',
          data: this.brokerLogs
            .map((log) => new Date(log.date).getDate())
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(
              (day) =>
                this.brokerLogs.filter(
                  (log) =>
                    new Date(log.date).getDate() === day && log.status === BrokerLogStatus.FAILED
                ).length
            ),
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Semi-transparent red
          borderColor: documentStyle.getPropertyValue('--red-500'),
          borderDash: [5, 5],
        },
        {
          label: 'Success',
          data: this.brokerLogs
            .map((log) => new Date(log.date).getDate())
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(
              (day) =>
                this.brokerLogs.filter(
                  (log) =>
                    new Date(log.date).getDate() === day && log.status === BrokerLogStatus.COMPLETED
                ).length
            ),
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Semi-transparent green
          borderColor: documentStyle.getPropertyValue('--green-500'),
          borderDash: [5, 5],
        },
        {
          label: 'Resent completed',
          data: this.brokerLogs
            .map((log) => new Date(log.date).getDate())
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(
              (day) =>
                this.brokerLogs.filter(
                  (log) =>
                    new Date(log.date).getDate() === day &&
                    log.status === BrokerLogStatus.RESENT_COMPLETED
                ).length
            ),
          fill: true,
          backgroundColor: 'rgba(153, 102, 255, 0.2)', // Semi-transparent purple
          borderColor: documentStyle.getPropertyValue('--purple-500'),
          borderDash: [5, 5],
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          min: 0,
          ticks: {
            color: textColorSecondary,
            stepSize: 1,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
