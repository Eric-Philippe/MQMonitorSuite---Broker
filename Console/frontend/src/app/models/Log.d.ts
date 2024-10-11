import { LogStatus } from './LogStatus';

export interface Log {
  author: string;
  date: number;
  msg: string;
  status: LogStatus;
}
