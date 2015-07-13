// Name  : message.js
// Author: Cerek Hillen
//
// Description:
//   Providing a central API to render messages in the message list - whatever
//   form they may take.

//////////
// Code //

withGlobal(function (global) {
    // A generic container across all message types.
    var MessageContainer = React.createClass({
        render: function () {
            return (
                <p className="chat-message">
                    <span className="chat-profile-container">
                        <img src={'/api/image?id=' + this.props.message.picture}
                             title={this.props.message.username}
                             alt={this.props.message.username}
                             className="chat-profile-picture" />
                    </span>

                    {this.props.children}

                    <span className="chat-message-time"> - {this.props.message.time.toString()}</span>
                </p>
            );
        }
    });

    // Rendering a message of type 'text'.
    var TextMessage = React.createClass({
        render: function () {
            return (
                <MessageContainer message={this.props.message}>
                    <span className="chat-message-text">{this.props.message.data.text}</span>
                </MessageContainer>
            );
        }
    });

    // A React class to take in message data and render it to the DOM.
    var Message = React.createClass({
        // Pawning off the rendering to other React classes based on the 'type'
        // metadata in a message.
        render: function () {
            if (this.props.message.type === 'text')
                return <TextMessage message={this.props.message} />
        }
    });

    /////////////
    // Exports //
    global.Message = Message;
});
