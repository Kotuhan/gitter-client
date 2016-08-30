import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectGitter, fetchMessagesIfNeeded, invalidateGitter } from '../actions'
import Messages from '../components/Messages'
import Room from '../components/Room'
import { Route, Link } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
  }
  componentDidMount() {
    // const { dispatch, selectedGitter } = this.props
    // dispatch(fetchMessagesIfNeeded(selectedGitter))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedGitter !== this.props.selectedGitter) {
      const { dispatch, selectedGitter } = nextProps
      dispatch(fetchMessagesIfNeeded(selectedGitter))
    }
  }

  handleSendMessage(){

    let chatId = '/'+this.props.params.chatId ;
    if(this.props.params.name) chatId+= "/"+this.props.params.name

    let authToken = JSON.parse(localStorage.getItem('gitter')).token
    let roomId =  JSON.parse(localStorage.getItem('gitter')).rooms
    .find( room => {
      return  room.url === chatId
    })
    var message = $('.message-text').val()

    var result = fetch(
        'https://api.gitter.im/v1/rooms/' + roomId.id + '/chatMessages?access_token=' + authToken,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: message
            })
        }
    );

    result
        .then(function(response) {
            return response.json();
        })
        .then(function(res) {
        })
        .catch(function(err) {
            console.log('Error fetching:', err);
        });

        //временный костыль до подключения faye
        setTimeout(() => {this.handleRefreshClick()}, 1000)


  }


  handleChange(nextGitter) {
    this.props.dispatch(selectGitter(nextGitter))
  }

  handleRefreshClick() {
    const { dispatch, selectedGitter } = this.props
    dispatch(invalidateGitter(selectedGitter))
    dispatch(fetchMessagesIfNeeded(selectedGitter))
  }

  render() {

    const { selectedGitter, messages, isFetching, lastUpdated, rooms} = this.props
    const isEmpty = messages.length === 0
    let roomsNames = rooms.items.map(function(room){
          return (
          room.name
        )})

    let roomsToDisplay = rooms.items.map(function(room){
              return (
                <Room name={room.name} avatar={room.avatarUrl} key={room.id} url={room.url} />
              );
            });

    return (
      <div className="main">
        <div className="rooms">
        {roomsToDisplay}
        </div>
        <div className="chat">
          <div className="view-messages">
            {isEmpty
              ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
              : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                  <Messages messages={messages} />
                </div>
            }
          </div>
          <div className="send-message">

              <textarea rows="4" cols="50" defaultValue="Type here" className="message-text">
              </textarea>
              <button
                className="sendMessageBtn"
                onClick = {this.handleSendMessage}
                 >
                 Send message
              </button>

          </div>
        </div>

      </div>
    )
  }
}

App.propTypes = {
  selectedGitter: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state, ownProps) {
  const {  messagesByGitter, rooms } = state
  let selectedGitter = '/'+ownProps.params.chatId ;
  if(ownProps.params.name) selectedGitter+= "/"+ownProps.params.name


  const {
    isFetching,
    lastUpdated,
    items: messages
  } = messagesByGitter[selectedGitter] || {
    isFetching: true,
    items: []
  }

  return {
    selectedGitter,
    messages,
    isFetching,
    lastUpdated,
    rooms
  }
}

export default connect(mapStateToProps)(App)
