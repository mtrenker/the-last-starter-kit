import Stats from './stats';

export interface IOutput {
  client: Stats;
  server: Stats;
}

const config = new WeakMap<Output, IOutput>();

export default class Output {
  public constructor(c: IOutput) {
    config.set(this, c);
  }
  public get client() {
    return config.get(this)!.client;
  }

   public get server() {
    return config.get(this)!.server;
  }
}
