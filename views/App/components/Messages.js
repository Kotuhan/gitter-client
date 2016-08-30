import React, { PropTypes, Component } from 'react'

export default class Messages extends Component {
  render() {

    return (
      <section className="chat">
        {this.props.messages.map((message, i) =>
          <article key={i}>
            <div className="message-author">
              {message.fromUser.username}
            </div>
            <p>{message.text}</p>
            <hr />
          </article>

        )}
      </section>
    )
  }
}

Messages.propTypes = {
  messages: PropTypes.array.isRequired
}
