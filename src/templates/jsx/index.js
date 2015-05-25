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

// The Chat portion of the application.
var Chat = React.createClass({
    onSubmit: function (e) {
        e.preventDefault();

        var chatInput = this.refs.chatInput.getDOMNode();
        socket.emit('message', chatInput.value);
        chatInput.value = '';
    },

    render: function () {
        return (
            <div>
                <Messages />

                <form onSubmit={this.onSubmit} className="chatForm">
                    <input ref="chatInput" type="text" className="chatInput" placeholder="Enter chat message" />
                    <button type="submit" className="chatButton">
                        <span className="glyphicon glyphicon-arrow-right"></span>
                    </button>
                </form>
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
    React.render(<Chat />, document.getElementById('chatApp'));
    React.render(<UserList />, document.getElementById('userListApp'));
});
