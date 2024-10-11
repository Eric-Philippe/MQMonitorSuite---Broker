import { Injectable } from '@angular/core';

import { BROKER_API } from '../conf/env';
import { ServiceStatus } from '../app/models/BrokerStatus';
import { ServiceStatusEnum } from '../app/models/BrokerStatusEnum';
import { DestinationProps } from 'src/app/models/DestinationProps';
import { DEFAULT_STATUS } from 'src/conf/utils';

@Injectable()
export class BrokerAppService {
  public brokerStatus: ServiceStatus = DEFAULT_STATUS;

  public pearApiStatus: ServiceStatus = DEFAULT_STATUS;

  /**
   * Get the broker status
   * @returns {Promise<ServiceStatus>} - The broker status
   */
  async getBrokerStatus(): Promise<ServiceStatus> {
    const start = Date.now();

    try {
      await fetch(BROKER_API + '/').then((response) => {
        this.brokerStatus = {
          latency: Date.now() - start,
          status: ServiceStatusEnum.UP,
        };
      });
    } catch (e) {
      this.brokerStatus = {
        latency: -1,
        status: ServiceStatusEnum.DOWN,
      };
    }

    return this.brokerStatus;
  }

  /**
   * Get the Pear API status
   * @returns {Promise<ServiceStatus>} - The Pear API status
   */
  async getPearAPIStatus(): Promise<ServiceStatus> {
    try {
      await fetch(BROKER_API + '/pearapistatus').then(async (response) => {
        const responseData = await response.json();
        this.pearApiStatus = {
          latency: responseData.responseTime,
          status: ServiceStatusEnum.UP,
        };
      });
    } catch (e) {
      this.pearApiStatus = {
        latency: -1,
        status: ServiceStatusEnum.DOWN,
      };
    }

    return this.pearApiStatus;
  }

  /**
   * Check if the broker is up
   * @returns {boolean} - True if the broker is up
   */
  public isUp(): boolean {
    return this.brokerStatus.status === ServiceStatusEnum.UP;
  }

  /**
   * Get Pear Broker Routing Properties
   * @returns {Promise<{ key: string; value: string }[]>} - The broker routing key-value properties
   */
  async getBrokerRoutingProperties(): Promise<{ key: string; value: string }[]> {
    try {
      const response = await fetch(`${BROKER_API}/properties`);

      return Object.entries(await response.json()).map(([key, value]: [string, string]) => ({
        key,
        value,
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Get the broker routing properties cleaned
   * @returns {Promise<Map<String, DestinationProps>>} - The broker routing properties cleaned
   */
  async getBrokerRoutingPropertiesCleaned(): Promise<Map<String, DestinationProps>> {
    let map = new Map<String, DestinationProps>();
    let data = await this.getBrokerRoutingProperties();

    for (let i = 0; i < data.length; i++) {
      let key = data[i].key.split('.')[0];
      let props = data[i].key.split('.')[1];
      let value = data[i].value;

      if (!map.has(key)) {
        map.set(key, {} as DestinationProps);
      }

      switch (props) {
        case 'CHANNEL':
          map.get(key).channel = value;
          break;
        case 'HOST':
          map.get(key).host = value;
          break;
        case 'PORT':
          map.get(key).port = value;
          break;
        case 'PROTOCOL':
          map.get(key).protocole = value;
          break;
        case 'QM':
          map.get(key).qm = value;
          break;
        case 'Q':
          map.get(key).q = value;
          break;
      }
    }

    return map;
  }

  /**
   * Get the broker app properties
   * @returns {Promise<{ key: string; value: string }[]>} - The broker app properties
   */
  async getBrokerAppProperties(): Promise<{ key: string; value: string }[]> {
    try {
      const response = await fetch(`${BROKER_API}/app-properties`);

      return Object.entries(await response.json()).map(([key, value]: [string, string]) => ({
        key,
        value,
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Get the broker routes with origin
   * @returns {Promise<{ key: string; value: string }[]>} - The broker routes with origin
   */
  async getBrokerRoutesWithOrigin(): Promise<{ key: string; value: string }[]> {
    try {
      const response = await fetch(`${BROKER_API}/app-routes`);

      return Object.entries(await response.json()).map(([key, value]: [string, string]) => ({
        key,
        value,
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Get the broker routes (without origin)
   * @returns {Promise<{ key: string; value: string }[]>} - The broker routes (without origin)
   */
  async getBrokerRoutes(): Promise<{ key: string; value: string }[]> {
    try {
      const res = await this.getBrokerRoutesWithOrigin();
      return res.filter((route) => route.key !== 'source');
    } catch (e) {
      return [];
    }
  }
}
