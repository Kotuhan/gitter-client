import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import User from '../components/User'
import Page from '../components/Page'
import * as pageActions from '../actions/PageActions'

class App extends Component {
  render() {
    let rooms = JSON.parse(gitter1).rooms.map(function(room){
          return (
            <Room name={room.name} url={room.avatarUrl} key={room.id} />
          );
        })
    return (
      <div className="main" key='12312312'>
        <div className="menu">
          {rooms}
        </div>
        <Chat />
      </div>
    )}
}


var Room  = React.createClass({

  render: function() {
    return (
      <div>
        <img src={this.props.url} className="room-icon" />
        <p className="room-name">{this.props.name}</p>
      </div>
    );
  }

});

var Chat  = React.createClass({

  render: function() {
    return (
      <div className="chat">
        {this.props.child}
        text
      </div>
    );
  }

});

function mapStateToProps(state) {
  return {
    user: state.user,
    page: state.page
  }
}

function mapDispatchToProps(dispatch) {
  return {
    pageActions: bindActionCreators(pageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
