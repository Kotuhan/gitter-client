import fetch from 'isomorphic-fetch'

export const REQUEST_MESSAGES = 'REQUEST_MESSAGES'
export const RECEIVE_MESSAGES = 'RECEIVE_MESSAGES'
export const SELECT_GITTER = 'SELECT_GITTER'
export const INVALIDATE_GITTER = 'INVALIDATE_GITTER'
export const INIT_ROOMS = 'INIT_ROOMS'




export function selectGitter(gitter) {
  return {
    type: SELECT_GITTER,
    gitter
  }
}

export function invalidateGitter(gitter) {
  return {
    type: INVALIDATE_GITTER,
    gitter
  }
}

function requestMessages(gitter) {
  return {
    type: REQUEST_MESSAGES,
    gitter
  }
}

function receiveMessages(gitter, json) {
  return {
    type: RECEIVE_MESSAGES,
    gitter,

    messages: json.map(child => child),

    receivedAt: Date.now()
  }
}

function fetchMessages(gitter) {
  return dispatch => {
    dispatch(requestMessages(gitter))

    let room = JSON.parse(localStorage.getItem('gitter')).rooms
    .find( room => {
      return room.url === gitter
    })
    let token = JSON.parse(localStorage.getItem('gitter')).token

    return fetch('https://api.gitter.im/v1/rooms/' + room.id + '/chatMessages?limit=20&access_token='+token)

      .then(response => response.json())
      .then((json) => {
        dispatch(receiveMessages(gitter, json))

      })
  }
}

function shouldFetchMessages(state, gitter) {
  const messages = state.messagesByGitter[gitter]
  if (!messages) {
    return true
  }
  if (messages.isFetching) {
    return false
  }
  return messages.didInvalidate
}

export function fetchMessagesIfNeeded(gitter) {
  return (dispatch, getState) => {
    if (shouldFetchMessages(getState(), gitter)) {
      return dispatch(fetchMessages(gitter))
    }
  }
}
