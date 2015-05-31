// Name  : index.js
// Author: Cerek Hillen
//
// Description:
//   The portion of this React application that is going to be running on every
//   single page.

//////////
// Code //

// The socket for this whooole page.
var socket = io();

// A React component to represent a single message.
var Message = React.createClass({
    // Rendering this single message.
    render: function () {
        return (
            <p className="chat-message">
                <span className="chat-message-username">{this.props.message.username}: </span>
                <span className="chat-message-text">{this.props.message.text}</span>
                <span className="chat-message-time"> - {this.props.message.time.toString()}</span>
            </p>
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
        return (
            <div className="chat-messages">
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
        var auth      = Cookies.get('auth');

        try       { auth = JSON.parse(auth); }
        catch (e) { auth = {};               }

        socket.emit('message', {
            username: auth.username,
            auth: auth.auth,
            text: chatInput.value,
            time: new Date()
        });

        chatInput.value = '';
    },

    // Rendering out the ChatBox.
    render: function () {
        return (
            <form onSubmit={this.onSubmit} className="chat-form">
                <input ref="chatInput" type="text" className="chat-input" placeholder="Enter chat message" />
                <button type="submit" className="chat-button">
                    <span className="glyphicon glyphicon-arrow-right"></span>
                </button>
            </form>
        );
    }
});

// The Chat portion of the application.
var Chat = React.createClass({
    // Upon this component mounting, attempt to register this user's socket.
    componentDidMount: function () {
        setTimeout(function () {
            var auth = Cookies.get('auth');
            socket.emit('register', auth);
        }, 0);
    },

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

// The React class to display a single user.
var User = React.createClass({
    // Rendering this user.
    render: function () {
        return (
            <tr><td><h4 className="text-center user">{this.props.username}</h4></td></tr>
        );
    }
});

// The application to manage the list of Users.
var UserList = React.createClass({
    // Returning the schema for this list of users.
    getInitialState: function () {
        return {
            users: null // ['This', 'Is', 'A', 'Bunch', 'Of', 'Random', 'Stuff', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']
        };
    },

    // Registering socket interaction on mounting this component.
    componentDidMount: function () {
        makeRequest({
            method: 'GET',
            path: '/api/currentusers',

            headers: {
                'Accept': 'application/json'
            },

            onload: function (response) {
                var users;

                try       { users = JSON.parse(response);                    }
                catch (e) { console.log('Could not get user list.'); return; }

                this.setState({ users: users });
                socket.on('userconnect'   , this.userConnect);
                socket.on('userdisconnect', this.userDisconnect);
            }.bind(this)
        });
    },

    // A user connecting.
    userConnect: function (username) {
        this.state.users.push(username);
    },

    // A user disconnecting.
    userDisconnect: function (username) {
        console.log('TODO: Remove a user.')
    },

    // Rendering the user list.
    render: function () {
        if (this.state.users === null) {
            return (
                <h3 className="text-center">Loading...</h3>
            );
        } else if (this.state.users.length === 0) {
            return (
                <h3 className="text-center">No users.</h3>
            );
        } else {
            var users = [];
            for (var i = 0; i < this.state.users.length; i++)
                users.push(<User username={this.state.users[i]} />);

            return (
                <div className="user-list">
                    <table className="table table-striped">
                        {users}
                    </table>
                </div>
            );
        }
    }
})

// Adding the series of React components.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<Chat />, document.getElementById('leftPane'));
    React.render(<UserList />, document.getElementById('rightPane'));
});
