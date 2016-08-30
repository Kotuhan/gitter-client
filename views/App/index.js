import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import { browserHistory, applyRouterMiddleware, Router } from 'react-router';
import Route from './routes/Route';


const initialRooms = {
  rooms: {
    items: JSON.parse(localStorage.getItem('gitter')).rooms
    .map( room => room )
  }
}


const store = configureStore(initialRooms)
render(
  <Provider store={store}>
    <Router history={browserHistory} routes={Route} />
  </Provider>,
  document.getElementById('root')
)
