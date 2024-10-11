import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Table } from 'primeng/table';
import { FilterService } from 'primeng/api';

import { BrokerLogsService } from '../../../service/BrokerLogs.service';
import { BrokerAppService } from '../../../service/BrokerApp.service';

import { BrokerLog } from '../../models/BrokerLog';
import { DestinationProps } from 'src/app/models/DestinationProps';
import { RerouteDialogComponent } from '../reroutedialog/reroute-dialog.component';
import { BrokerLogStatus, StatusSeverityColor } from 'src/app/models/BrokerLogStatus';
import { BrokerLogFrom, LogFromToColor, LogFromToIcon } from 'src/app/models/BrokerLogFrom';

import { ImportsModule } from 'src/app/imports';
import { TRANSFERT_TIME_LEVELS } from 'src/conf/env';
import { NOT_FINISHED_STATUS } from 'src/conf/utils';

@Component({
  selector: 'logs-table',
  standalone: true,
  imports: [ImportsModule, RerouteDialogComponent],
  templateUrl: './logstable.component.html',
  styleUrls: ['./logstable.component.scss'],
  providers: [BrokerLogsService, BrokerAppService],
})
export class LogsTableComponent implements OnInit, OnChanges {
  @Input() public brokerLogs: BrokerLog[] = [];
  @Input() public routesProperties: Map<string, DestinationProps> = new Map();
  @Input() public loading = true;
  @Input() public isBrokerUp: boolean;

  public displayDestinationInfoOnHover: boolean =
    localStorage.getItem('destinationInfoOnHover') !== 'false';
  public messageBoxOnHover: boolean = localStorage.getItem('messageBoxOnHover') !== 'false';

  public searchValue?: string;
  public selectedDateFilter: string;
  public selectedDate: Date;

  public statuses: { label: string; value: string }[] = [];
  public clientIds: { label: string; value: string }[] = [];
  public exchangeIds: { label: string; value: string }[] = [];
  public workIds: { label: string; value: string }[] = [];

  public resendModalVisible = false;
  public resendLog: BrokerLog = {} as BrokerLog;

  private expandedLogId?: string;

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.buildSelects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildSelects();
  }

  private buildSelects(): void {
    this.statuses = this.buildUniqueSelectOptions(this.brokerLogs.map((log) => log.status));
    this.clientIds = this.buildUniqueSelectOptions(this.brokerLogs.map((log) => log.clientId));
    this.exchangeIds = this.buildUniqueSelectOptions(this.brokerLogs.map((log) => log.exchangeId));
    this.workIds = this.buildUniqueSelectOptions(this.brokerLogs.map((log) => log.workId));
  }

  private buildUniqueSelectOptions(values: string[]): { label: string; value: string }[] {
    const uniqueValues = [...new Set(values)];
    return uniqueValues.map((value) => ({ label: value, value }));
  }

  public getFirstDateFromBrokerLog(unixtimestamp: number): string {
    const date = new Date(unixtimestamp * 1000);
    return date.toLocaleString();
  }

  public toggleRow(brokerLog: BrokerLog): void {
    this.expandedLogId = this.expandedLogId === brokerLog.mqMsgId ? undefined : brokerLog.mqMsgId;
  }

  public clear(table: Table): void {
    table.clear();
    this.searchValue = '';
  }

  public getSeverity(status: string): string {
    return StatusSeverityColor.get(status as BrokerLogStatus) || 'default';
  }

  public getTagSeverity(value: number, status: BrokerLogStatus): string {
    if (NOT_FINISHED_STATUS.includes(status)) {
      return 'secondary';
    } else if (value < TRANSFERT_TIME_LEVELS[0]) {
      return 'success';
    } else if (value < TRANSFERT_TIME_LEVELS[1]) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  public getFromSeverity(from: string): string {
    return LogFromToColor[from] || 'default';
  }

  public getFromIcon(from: string): string {
    return LogFromToIcon[from] || 'default';
  }

  public isFromWarning(from: string): boolean {
    return from === BrokerLogFrom.MEMORY || from === BrokerLogFrom.FILE;
  }

  public getDestinationProps(key: string): DestinationProps {
    if (!key || !this.routesProperties.has(key)) {
      return {
        host: 'N/A',
        qm: 'N/A',
        channel: 'N/A',
        q: 'N/A',
        protocole: 'N/A',
      };
    }
    return this.routesProperties.get(key) as DestinationProps;
  }

  public getReducedMessage(message: string): string {
    return message.length > 20 ? `${message.substring(0, 17)}...` : message;
  }

  public showDialog(log: BrokerLog): void {
    this.resendModalVisible = true;
    this.resendLog = log;
  }

  public getTransfertTime(transfertTime: number, status: BrokerLogStatus): string {
    if (NOT_FINISHED_STATUS.includes(status)) {
      return 'N/A';
    }
    if (transfertTime < 1000) {
      return `${transfertTime} ms`;
    }
    if (transfertTime < 60000) {
      return `${Math.floor(transfertTime / 1000)} s`;
    }
    if (transfertTime < 3600000) {
      return `${Math.floor(transfertTime / 60000)} m ${Math.floor(
        (transfertTime % 60000) / 1000
      )} s`;
    }
    return `${Math.floor(transfertTime / 3600000)} h ${Math.floor(
      (transfertTime % 3600000) / 60000
    )} m`;
  }
}
