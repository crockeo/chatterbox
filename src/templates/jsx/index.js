// Name  : index.js
// Author: Cerek Hillen
//
// Description:
//   The portion of this React application that is going to be running on every
//   single page.

// The socket for this whooole page.
var socket = io();

// A React component to represent a single message.
var Message = React.createClass({
    // Rendering this single message.
    render: function () {
        return (
            <p>{this.props.message}</p>
        );
    }
});

// Displaying other people's (and your own) messages.
var Messages = React.createClass({
    // Getting the initial (empty) set of messages.
    getInitialState: function () {
        return { messages: [] };
    },

    // Registering functionality atop the socket when the messages mount.
    componentDidMount: function () {
        socket.on('message' , function (msg) {
            var newMessages = this.state.messages;
            newMessages.push(<Message message={msg} />);

            this.setState({
                messages: newMessages
            });
        }.bind(this));
    },

    // Rendering the set of messages.
    render: function () {
        console.log(this.state.messages);
        return (
            <div className="chatMessages">
                {this.state.messages}
            </div>
        );
    }
});

var ChatBox = React.createClass({
    // Functionality to perform when the user attempts to submit a new message.
    onSubmit: function (e) {
        e.preventDefault();

        var chatInput = this.refs.chatInput.getDOMNode();
        socket.emit('message', chatInput.value);
        chatInput.value = '';
    },

    // Rendering out the ChatBox.
    render: function () {
        return (
            <form onSubmit={this.onSubmit} className="chatForm">
                <input ref="chatInput" type="text" className="chatInput" placeholder="Enter chat message" />
                <button type="submit" className="chatButton">
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
            <div>
                <Messages />
                <ChatBox />
            </div>
        );
    }
});

// The application to manage the list of Users.
var UserList = React.createClass({
    render: function () {
        return (
            <h1>Right pane</h1>
        );
    }
})

// Adding the series of React components.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<Chat />, document.getElementById('leftPane'));
    React.render(<UserList />, document.getElementById('rightPane'));
});
