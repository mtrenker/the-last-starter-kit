import 'cross-fetch/polyfill';
import { Context } from 'koa';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { StaticRouter } from 'react-router';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import Root from '@/components/root';
import Output from '@/lib/output';
import { ThemeProvider } from '@/lib/styledComponents';
import defaultTheme from '@/themes/default';
import Html from '@/views/ssr';

export interface IRouterContext {
  status?: number;
  url?: string;
}

export default function (output: Output) {

  return async (ctx: Context) => {

    const sheet = new ServerStyleSheet();

    const routerContext: IRouterContext = {};

    const components = (
      <StyleSheetManager sheet={sheet.instance}>
        <ThemeProvider theme={defaultTheme}>
          <StaticRouter location={ctx.request.url} context={routerContext}>
            <Root />
          </StaticRouter>
        </ThemeProvider>
      </StyleSheetManager>
    );

    if ([301, 302].includes(routerContext.status!)) {
      ctx.status = routerContext.status!;
      ctx.redirect(routerContext.url!);
      return;
    }

    if (routerContext.status === 404) {
      ctx.status = 404;
      ctx.body = 'Not found';
      return;
    }

    const reactRender = ReactDOMServer.renderToString(
      <Html
        css={output.client.main('css')!}
        helmet={Helmet.renderStatic()}
        js={output.client.main('js')!}
        styles={sheet.getStyleElement()}
        window={}>
        {components}
      </Html>,
    );

    ctx.type = 'text/html';
    ctx.body = `<!DOCTYPE html>${reactRender}`;
  };
}
