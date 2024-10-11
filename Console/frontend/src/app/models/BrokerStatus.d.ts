import { ServiceStatusEnum } from './BrokerStatusEnum';

export interface ServiceStatus {
  latency: number;
  status: ServiceStatusEnum;
}
