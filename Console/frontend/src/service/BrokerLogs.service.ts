import { Injectable } from '@angular/core';

import { BROKER_API, RECENT_THRESHOLD } from '../conf/env';
import { BrokerLog } from '../app/models/BrokerLog';
import { BrokerLogStatus } from 'src/app/models/BrokerLogStatus';
import { DestinationProps } from 'src/app/models/DestinationProps';

@Injectable()
export class BrokerLogsService {
  /** @type {BrokerLog[]} - Keep in memory the broker logs */
  public brokerLogs: BrokerLog[] = [];

  /**
   * Get all broker logs
   * @returns {Promise<BrokerLog[]>} - The broker logs
   */
  async getAllBrokerLogs(): Promise<BrokerLog[]> {
    try {
      return await fetch(BROKER_API + '/logs/')
        .then((res) => res.json())
        .then((res) => {
          this.brokerLogs = res.history.map((log) => {
            return {
              clientId: log.clientId,
              companyId: log.companyId,
              content: log.content,
              destination: log.destination,
              exchangeId: log.exchangeId,
              from: log.from,
              mqMsgId: log.mqMsgId,
              status: log.status,
              date: new Date(log.logs[0].date * 1000),
              strDate: new Date(log.logs[0].date * 1000).toLocaleString(),
              transfertTime: log.transfertTime,
              logs: log.logs,
              workId: log.workId,
            };
          });

          return this.brokerLogs;
        });
    } catch (e) {
      return this.brokerLogs;
    }
  }

  /**
   * Get the recent broker logs
   * @returns {Promise<BrokerLog[]>} - The recent broker logs
   */
  async getRecentErrorBrokerLogs(): Promise<BrokerLog[]> {
    let recentLogs: BrokerLog[] = await this.getAllBrokerLogs();
    return recentLogs.filter(
      (log) =>
        log.status === BrokerLogStatus.FAILED &&
        new Date().getTime() - log.date.getTime() < RECENT_THRESHOLD
    );
  }

  async rerouteMessage(
    mqMsgId: string,
    author: string,
    clientId: string,
    destination: string,
    destinationProps?: DestinationProps
  ) {
    let body = {
      mqMsgId: mqMsgId,
      author: author,
      clientId: clientId,
      destination: destination,
    };

    if (destination != 'Try automatic routing') {
      body['host'] = destinationProps.host;
      body['port'] = destinationProps.port;
      body['qm'] = destinationProps.qm;
      body['channel'] = destinationProps.channel;
      body['q'] = destinationProps.q;
      body['protocole'] = destinationProps.protocole;
    } else {
      body['destination'] = 'AUTOMATIC';
    }

    await fetch(BROKER_API + '/logs/reroute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}
