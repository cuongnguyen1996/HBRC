import mqtt, { ISubscriptionMap, MqttClient } from 'mqtt';
import { BaseTransporter } from './base';

export type MqttTransporterOptions = {
  url: string;
  clientId: string;
  username: string;
  password: string;
  publishTopic: string;
  subscribeTopics: string[];
  qos?: 0 | 1 | 2;
};

export class MqttTransporter extends BaseTransporter {
  private mqttClient?: MqttClient;
  constructor(private readonly options: MqttTransporterOptions) {
    super();
    if (options.qos === undefined) {
      options.qos = 1;
    }
    console.log('createMqttTransporter', options);
  }

  protected _connect(): void {
    console.log('connect mqtt', this.options);
    const { url, username, password, subscribeTopics, clientId, qos } = this.options;
    const client = mqtt.connect(url, {
      username: username,
      password: password,
      clientId: clientId,
      protocolVersion: 4,
      clean: qos != 0,
      connectTimeout: 30000,
      keepalive: 30,
    });
    const subscribeTopicsMap = subscribeTopics.reduce((acc: ISubscriptionMap, topic) => {
      acc[topic] = { qos: qos };
      return acc;
    }, {});
    this.mqttClient = client;
    client.on('connect', () => {
      console.log('mqtt connected', subscribeTopicsMap);
      client.subscribe(subscribeTopicsMap);
      this.onConnectedCallback && this.onConnectedCallback();
    });
    client.on('message', this.onMessage.bind(this));
    client.on('disconnect', (e) => {
      console.log('mqtt disconnected', e);
    });
  }
  async send(data: any) {
    if (!this.mqttClient) {
      throw new Error('mqtt client not connected');
    }
    const { publishTopic } = this.options;
    const message = JSON.stringify(data);
    console.log('send message', { message, publishTopic });
    this.mqttClient.publish(publishTopic, message);
  }

  private onMessage(topic: string, message: Buffer) {
    const msg = this.parseMessage(message);
    // console.log('mqtt receive message', msg);
    if (this.onReceiveCallback && msg) {
      this.onReceiveCallback(msg);
    }
  }

  private parseMessage(message: Buffer) {
    try {
      return JSON.parse(message.toString());
    } catch (e) {
      return null;
    }
  }
}
