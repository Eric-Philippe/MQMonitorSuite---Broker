import { BrokerLogFrom } from './BrokerLogFrom';

import { BrokerLogStatus } from './BrokerLogStatus';

import { Log } from './Log';

export interface BrokerLog {
  clientId: string;
  companyId: string;
  content: string;
  destination: string;
  exchangeId: string;
  from: BrokerLogFrom;
  mqMsgId: string;
  status: BrokerLogStatus;
  transfertTime: number;
  workId: string;
  date: Date;
  strDate: string;
  logs: Log[];
}
