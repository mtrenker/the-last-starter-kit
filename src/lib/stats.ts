import * as lodash from 'lodash';

export interface IStats {
  assetsByChunkName?: {
    main: string | string[];
  };
}

const config = new WeakMap<Stats, IStats>();

export default class Stats {
  public constructor(stats: IStats = {}) {

    config.set(this, stats);
  }

  public get raw(): any {
    return config.get(this)!;
  }

  public main(ext: string): string | undefined {
    const main: string | string[] = lodash.get(config.get(this)!, 'assetsByChunkName.main', []);
    const file = (Array.isArray(main) ? main : [main]).find((c: string) => c.endsWith(`.${ext}`));
    return file && `/${file}`;
  }
}
