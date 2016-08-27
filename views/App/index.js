import React from 'react'
import { render } from 'react-dom'
import App from './containers/App'
import './styles/app.css'
import Route from './routes/Route';
import { browserHistory, applyRouterMiddleware, Router } from 'react-router';


render(
  <Router history={browserHistory} routes={Route} />
,
  document.getElementById('root')
)
