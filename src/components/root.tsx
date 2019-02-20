import * as React from 'react';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import routes from '@/data/routes';

const Root = () => (
  <div>
    <Helmet>
      <title>Some title</title>
    </Helmet>
    <Switch>
      {routes.map(route => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  </div>
);

export default hot(module)(Root);
