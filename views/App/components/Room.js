import React, { Component } from 'react'
import { Link } from 'react-router';


var Room = React.createClass({
  render: function() {
    let linkUrl = '/home' + this.props.url;

  return (
    <div>
      <img src={this.props.avatar} className="room-icon" />
      <Link to={linkUrl}><p className="room-name">{this.props.name}</p></Link>
    </div>
  );
}

});

module.exports = Room;
