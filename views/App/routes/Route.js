import React from 'react';
import { Route, Redirect, IndexRoute } from 'react-router';

import App from '../containers/App';
import Messages from '../components/Messages'

export default (
  <Route path='/home' component={App}>
      <Route path='/home/:chatId' component={Messages} />
      <Route path='/home/:chatId/:name' component={Messages} />
  </ Route>
);
