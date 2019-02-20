import { RouteProps } from 'react-router-dom';

import Player from '@/containers/Player';

const routes: RouteProps[] = [
  {
    component: Player,
    exact: true,
    path: '/',
  },
];

export default routes;
