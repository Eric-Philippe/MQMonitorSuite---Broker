import { BrokerLogStatus } from 'src/app/models/BrokerLogStatus';
import { ServiceStatusEnum } from 'src/app/models/BrokerStatusEnum';

export const DEFAULT_STATUS = {
  latency: 0,
  status: ServiceStatusEnum.UP,
};

export const NOT_FINISHED_STATUS = [
  BrokerLogStatus.RECEIVED,
  BrokerLogStatus.RESENT_PENDING,
  BrokerLogStatus.FAILED,
];
