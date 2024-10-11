const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

export const BROKER_API = 'http://localhost:80';
export const REFRESH_TIME = 1000 * 30;
export const TRANSFERT_TIME_LEVELS = [FIVE_MINUTES, THIRTY_MINUTES];
export const RECENT_THRESHOLD = 1000 * 60 * 60 * 24 * 7 * 3; // 3 weeks

export const BROKER_ENV = 'Zdr';
export const BROKER_VERSION = '2.0.0';

const ENV = {
  BROKER_API,
  REFRESH_TIME,
  TRANSFERT_TIME_LEVELS,
  RECENT_THRESHOLD,
};

export default ENV;
