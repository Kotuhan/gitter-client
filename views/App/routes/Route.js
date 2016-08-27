import React from 'react';
import { Route, Redirect, IndexRoute } from 'react-router';

import App from '../containers/App';
import User from '../components/User'

export default (
  <Route path='/home' component={App}>
      <IndexRoute component={App}/>
      <Route path='/home/user' component={User} />
  </ Route>
);
