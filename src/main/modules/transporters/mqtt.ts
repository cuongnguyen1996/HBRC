import mqtt, { MqttClient } from 'mqtt';
import { BaseTransporter, Transporter } from './base';

export type MqttTransporterOptions = {
  url: string;
  username: string;
  password: string;
  publishTopic: string;
  subscribeTopics: string[];
};

export class MqttTransporter extends BaseTransporter {
  private mqttClient?: MqttClient;
  constructor(private readonly options: MqttTransporterOptions) {
    super();
  }

  connect(): void {
    const { url, username, password, subscribeTopics } = this.options;
    const client = mqtt.connect(url, {
      username: username,
      password: password,
    });
    this.mqttClient = client;
    client.on('connect', () => {
      client.subscribe(subscribeTopics);
    });
    client.on('message', (topic, message) => {
      if (this.onReceiveCallback) {
        this.onReceiveCallback(message.toString());
      }
    });
  }
  async send(data: any) {
    if (!this.mqttClient) {
      throw new Error('mqtt client not connected');
    }
    const { publishTopic } = this.options;
    this.mqttClient.publish(publishTopic, data);
  }
}
