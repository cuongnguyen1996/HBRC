import axios, { AxiosInstance } from 'axios';
import { BaseTransporter } from './base';

export type HttpTransporterOptions = {
  puller: {
    url: string;
    params?: Record<string, string>;
    headers?: Record<string, string>;
    intervalSeconds: number;
  };
  pusher: {
    url: string;
    params?: Record<string, string>;
    headers?: Record<string, string>;
  };
};

export class HttpTransporter extends BaseTransporter {
  private puller: AxiosInstance;
  private pusher: AxiosInstance;
  constructor(private readonly options: HttpTransporterOptions) {
    super();
    this.puller = axios.create({
      baseURL: options.puller.url,
      params: options.puller.params,
      headers: options.puller.headers,
    });
    this.pusher = axios.create({
      baseURL: options.pusher.url,
      params: options.pusher.params,
      headers: options.pusher.headers,
    });
  }

  connect(): void {
    const { intervalSeconds } = this.options.puller;
    setInterval(async () => {
      try {
        const res = await this.puller.get('');
        if (this.onReceiveCallback) {
          this.onReceiveCallback(res.data);
        }
      } catch (e) {
        console.log(e.error);
      }
    }, intervalSeconds * 1000);
  }

  async send(data: any) {
    await this.pusher.post('', data);
  }
}
