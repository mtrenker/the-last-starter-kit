import * as chalk from 'chalk';
import * as KoaWebpack from 'koa-webpack';

import hotServerMiddleware from '../lib/hotServerMiddleware';
import { app, common, compiler } from './app';

common.spinner
  .info(chalk.default.magenta('Development mode'))
  .info('Building development server...');

app.listen({ port: common.port, host: 'localhost' }, async () => {

  const koaWebpackMiddleware = await KoaWebpack({
    compiler: compiler as any,
    devMiddleware: {
      logLevel: 'info',
      publicPath: '/',
      stats: false,
    },
  });

  app
    .use(koaWebpackMiddleware)
    .use(hotServerMiddleware(compiler));

  (compiler as any).hooks.done.tap('built', () => {
    common.spinner.succeed(`Running on http://localhost:${common.port}`);
  });
});
