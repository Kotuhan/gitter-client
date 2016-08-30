import { combineReducers } from 'redux'
import {
  SELECT_GITTER, INVALIDATE_GITTER,
  REQUEST_MESSAGES, RECEIVE_MESSAGES,
  INIT_ROOMS
} from '../actions'

function selectedGitter(state = '', action) {
  switch (action.type) {
    case SELECT_GITTER:
      return action.gitter
    default:
      return state
  }
}

function rooms(state = {
  items : []
  }, action) {
  switch (action.type) {
    default:
      return state
  }
}


function messages(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {

  switch (action.type) {
    case INVALIDATE_GITTER:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_MESSAGES:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_MESSAGES:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.messages,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function messagesByGitter(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_GITTER:
    case RECEIVE_MESSAGES:
    case REQUEST_MESSAGES:
      return Object.assign({}, state, {
        [action.gitter]: messages(state[action.gitter], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  messagesByGitter,
  selectedGitter,
  rooms
})

export default rootReducer
