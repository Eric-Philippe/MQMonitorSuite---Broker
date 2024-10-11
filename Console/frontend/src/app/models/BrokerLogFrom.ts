// ENUM
export enum BrokerLogFrom {
  API = 'API',
  MEMORY = 'Memory',
  FILE = 'File',
  MANUAL = 'Manual',
}

export const LogFromToColor = {
  [BrokerLogFrom.API]: 'info',
  [BrokerLogFrom.MEMORY]: 'warning',
  [BrokerLogFrom.FILE]: 'warning',
  [BrokerLogFrom.MANUAL]: 'secondary',
};

export const LogFromToIcon = {
  [BrokerLogFrom.API]: 'pi pi-cloud',
  [BrokerLogFrom.MEMORY]: 'pi pi-server',
  [BrokerLogFrom.FILE]: 'pi pi-file',
  [BrokerLogFrom.MANUAL]: 'pi pi-user',
};
