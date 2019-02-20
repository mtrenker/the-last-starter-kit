import * as fs from 'fs';
import * as path from 'path';

import * as koaCors from 'kcors';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as KoaRouter from 'koa-router';
import * as koaSend from 'koa-send';
import * as session from 'koa-session';

import * as ms from 'microseconds';

import * as webpack from 'webpack';

import * as ora from 'ora';

import client from '../webpack/client';
import server from '../webpack/server';

function staticMiddleware(root: string, immutable = true): Koa.Middleware {
  return async (ctx, next) => {
    try {
      if (ctx.path !== '/') {

        // If we're in production, try <dist>/public first
        return await koaSend(
          ctx as any,
          ctx.path,
          {
            immutable,
            root,
          },
        );
      }
    } catch (e) { /* Error? Go to next middleware... */ }
    return next();
  };
}

const dist = path.resolve(__dirname, '..', '..', 'dist');

export const common = {
  compiled: {
    clientStats: path.resolve(dist, 'client.stats.json'),
    server: path.resolve(dist, 'server.js'),
    serverStats: path.resolve(dist, 'server.stats.json'),
  },
  dist,
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  spinner: ora() as any,
};

export const compiler = webpack([server, client]);

export function build() {
  return new Promise(resolve => {
    compiler.run((e, fullStats) => {

      // If there's an error, exit out to the console
      if (e) {
        common.spinner.fail(e.message);
        process.exit(1);
      }

      const stats = fullStats.toJson();

      if (stats.errors.length) {
        common.spinner.fail(stats.errors.join('\n'));
        process.exit(1);
      }

      [common.compiled.serverStats, common.compiled.clientStats].forEach((file, i) => {
        fs.writeFileSync(file, JSON.stringify(stats.children[i]), {
          encoding: 'utf8',
        });
      });

      resolve();
    });
  });
}

const router = new KoaRouter()
  .get('/ping', async ctx => {
    ctx.body = 'pong';
  })
  .get('/favicon.ico', async ctx => {
    ctx.status = 204;
  });

export const app = new Koa();

app.proxy = true;

app.keys = ['someSecretKey'];

app.use(koaCors());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log('Error:', e);
    ctx.status = 500;
    ctx.body = 'There was an error. Please try again later.';
  }
});

// Timing
app.use(async (ctx, next) => {
  const start = ms.now();
  await next();
  const end = ms.parse(ms.since(start));
  const total = end.microseconds + (end.milliseconds * 1e3) + (end.seconds * 1e6);
  ctx.set('Response-Time', `${total / 1e3}ms`);
});

// Static file serving
// In production, check <dist>/public first
if (common.isProduction) {
  app.use(staticMiddleware(
    path.resolve(common.dist, 'public'),
  ));
}

// ... and then fall-back to <root>/public
app.use(staticMiddleware(
  path.resolve(common.dist, '..', 'public'),
  false,
));

app.use(bodyParser())
  .use(session(app));

// Router
app.use(router.allowedMethods())
  .use(router.routes());
