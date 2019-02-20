import createBrowserHistory from 'history/createBrowserHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import { ThemeProvider } from '@/lib/styledComponents';
import Root from '@/components/root';
import defaultTheme from '@/themes/default';

const history = createBrowserHistory();

// Render
ReactDOM.hydrate(
  <ThemeProvider theme={defaultTheme}>
    <Router history={history}>
      <Root />
    </Router>
  </ThemeProvider>,
  document.getElementById('root'),
);
