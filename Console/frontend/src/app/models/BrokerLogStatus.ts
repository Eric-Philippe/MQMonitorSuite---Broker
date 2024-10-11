import { LogStatus } from './LogStatus';

export enum BrokerLogStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RECEIVED = 'RECEIVED',
  RESENT_PENDING = 'RESENT_PENDING',
  RESENT_COMPLETED = 'RESENT_COMPLETED',
}

export const BrokerLogStatusLabels: Map<BrokerLogStatus, string> = new Map([
  [BrokerLogStatus.COMPLETED, 'Completed'],
  [BrokerLogStatus.FAILED, 'Failed'],
  [BrokerLogStatus.RECEIVED, 'Received'],
  [BrokerLogStatus.RESENT_PENDING, 'Resent pending'],
  [BrokerLogStatus.RESENT_COMPLETED, 'Resent completed'],
] as [BrokerLogStatus, string][]);

export const StatusSeverityColor: Map<BrokerLogStatus | LogStatus, string> = new Map([
  [BrokerLogStatus.COMPLETED, 'success'],
  [BrokerLogStatus.FAILED, 'danger'],
  [BrokerLogStatus.RECEIVED, 'secondary'],
  [BrokerLogStatus.RESENT_PENDING, 'secondary'],
  [BrokerLogStatus.RESENT_COMPLETED, 'info'],
  [LogStatus.ERROR, 'danger'],
  [LogStatus.INFO, 'info'],
  [LogStatus.WARN, 'warning'],
] as [BrokerLogStatus | LogStatus, string][]);
