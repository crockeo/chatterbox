// Name  : index.js
// Author: Cerek Hillen
//
// Description:
//   The portion of this React application that is going to be running on every
//   single page.

// The socket for this whooole page.
var socket = io();

// Displaying other people's (and your own) messages.
var Messages = React.createClass({
    render: function () {
        return (
            <div className="chatMessages">

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
