import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImportsModule } from 'src/app/imports';
import { BrokerLog } from 'src/app/models/BrokerLog';
import { BrokerAppService } from '@service/BrokerApp.service';
import { DestinationProps } from 'src/app/models/DestinationProps';
import { BrokerLogsService } from '@service/BrokerLogs.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reroute-dialog',
  standalone: true,
  imports: [ImportsModule],
  providers: [BrokerAppService, BrokerLogsService, MessageService],
  templateUrl: 'reroute-dialog.component.html',
})
export class RerouteDialogComponent implements OnInit {
  @Input() public msg: BrokerLog;
  @Output() public resentModalVisibleChange = new EventEmitter<boolean>();
  @Output() public dialogClosed = new EventEmitter<void>();

  private _resentModalVisible: boolean = false;

  public destinations: { key: string; value: string }[] = [];
  public destinationsProps: Map<String, DestinationProps> = new Map();
  public selectedDestination: { key: string; value: string };
  public destinationProps: DestinationProps;

  constructor(
    private brokerAppService: BrokerAppService,
    private brokerLogsService: BrokerLogsService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    let allRoutes = await this.brokerAppService.getBrokerRoutes();

    let destinationSet = new Set(allRoutes.map((route) => route.value));
    destinationSet.add('Try automatic routing');
    this.destinations = Array.from(destinationSet).map((destination) => {
      return { key: destination, value: destination };
    });

    this.destinationsProps = await this.brokerAppService.getBrokerRoutingPropertiesCleaned();
  }

  @Input()
  set resentModalVisible(value: boolean) {
    this._resentModalVisible = value;
    this.resentModalVisibleChange.emit(this._resentModalVisible);
    if (!value) {
      this.dialogClosed.emit(); // Emit event when dialog closes
    }
  }

  get resentModalVisible(): boolean {
    return this._resentModalVisible;
  }

  routePropertiesAvailable(): boolean {
    if (!this.selectedDestination) {
      return false;
    }

    let areRoutePropertiesAvailable = this.destinationsProps.has(this.selectedDestination.value);
    if (areRoutePropertiesAvailable) {
      this.destinationProps = this.destinationsProps.get(this.selectedDestination.value);
    }

    return areRoutePropertiesAvailable;
  }

  send() {
    let mqMsgId = this.msg.mqMsgId;
    let clientId = this.msg.clientId;
    let author = localStorage.getItem('authUser') || 'unknown';
    let destination = this.selectedDestination.value;

    try {
      this.brokerLogsService.rerouteMessage(
        mqMsgId,
        author,
        clientId,
        destination,
        this.destinationProps
      );

      this.resentModalVisible = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Message resent',
        detail: 'Message was successfully resent, refresh the page to see the changes',
        life: 5000,
      });
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while resending the message',
      });
    }
  }
}
