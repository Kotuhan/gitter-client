import React from 'react';
import { Route, Redirect, IndexRoute } from 'react-router';

import App from '../vievs/App/containers/App';


export default (
  <Route path='/home' component={App}>
      <IndexRoute component={LoginContainer}/>
      <Route path='/home/' component={App}> />
  </ Route>
);


// function requireAuth(nextState, replace) {
//   if (!localStorage.fbResponse) {
//     replace({
//       pathname: '/',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   } else {
//     console.log('logged on')
//   }
// }
