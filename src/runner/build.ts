import * as chalk from 'chalk';

import { build, common } from './app';

common.spinner.info(chalk.default.bgBlue('Build mode'));

void (async () => {
  await build();
  common.spinner.succeed('Finished building');
})();
