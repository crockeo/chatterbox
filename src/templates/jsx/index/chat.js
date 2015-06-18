// Name  : chat.js
// Author: Cerek Hillen
//
// Description:
//   The portion of the chat application that interacts directly with sending
//   and receiving messages.

//////////
// Code //

withGlobal(function (global) {
    // A React component to represent a single message.
    var Message = React.createClass({
        // Rendering this single message.
        render: function () {
            return (
                <p className="chat-message">
                    <span className="chat-profile-container">
                        <img src={"/static/img/profiles/" + this.props.message.picture}
                             title={this.props.message.username}
                             alt={this.props.message.username}
                             className="chat-profile-picture" />
                    </span>

                    <span className="chat-message-text">{this.props.message.text}</span>
                    <span className="chat-message-time"> - {this.props.message.time.toString()}</span>
                </p>
            );
        }
    });

    // Displaying other people's (and your own) messages.
    var Messages = React.createClass({
        //
        componentDidUpdate: function (prevProps) {
            if (prevProps.messages !== this.props.messages) {
                var div = this.refs.chatMessages.getDOMNode();
                div.scrollTop = div.scrollHeight;
            }
        },

        // Rendering the set of messages.
        render: function () {
            var messages = [];
            for (var i = 0; i < this.props.messages.length; i++)
                messages.push(<Message message={this.props.messages[i]}
                                       key={i} />);

            return (
                <div ref="chatMessages" className="chat-messages" onScroll={this.onScroll}>
                    {messages}
                </div>
            );
        }
    });

    var ChatBox = React.createClass({
        // Functionality to perform when the user attempts to submit a new message.
        onSubmit: function (e) {
            if (this.props.connected) {
                e.preventDefault();

                var chatInput = this.refs.chatInput.getDOMNode();
                var auth      = Cookies.get('auth');

                try       { auth = JSON.parse(auth); }
                catch (e) { auth = {};               }

                this.props.socket.emit('message', {
                    channel : 'main',
                    username: auth.username,
                    auth    : auth.auth,
                    text    : chatInput.value,
                    time    : new Date()
                });

                chatInput.value = '';
            }
        },

        // Rendering out the ChatBox.
        render: function () {
            return (
                <form onSubmit={this.onSubmit} className="chat-form">
                    <input placeholder={this.props.connected ? 'Enter chat messages.' : 'Waiting for server connection...'}
                           disabled={!this.props.connected}
                           className="chat-input"
                           ref="chatInput" />

                    <button type="submit" className="chat-button">
                        <span className="glyphicon glyphicon-arrow-right"></span>
                    </button>
                </form>
            );
        }
    });

    // The Chat portion of the application.
    var Chat = React.createClass({
        // Rendering out the whole chat portion of the application - both the
        // Messages and the ChatBox.
        render: function () {
            return (
                <div className="max-height">
                    <Messages messages={this.props.messages} />
                    <ChatBox connected={this.props.connected}
                             socket={this.props.socket} />
                </div>
            );
        }
    });

    global.Chat = Chat;
});