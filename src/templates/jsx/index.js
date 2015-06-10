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

            socket.emit('message', {
                username: auth.username,
                auth: auth.auth,
                text: chatInput.value,
                time: new Date()
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
                <ChatBox connected={this.props.connected} />
            </div>
        );
    }
});

// The React class to display a single user.
var User = React.createClass({
    // Rendering this user.
    render: function () {
        return (
            <div className="user-list-row">
                <a href={'/profile.html?username=' + this.props.user.username}>
                    <img src={'/static/img/profiles/' + this.props.user.picture}
                         className="user-list-picture" />

                    <span className="text-center user-list-username">{this.props.user.username}</span>
                </a>
            </div>
        );
    }
});

// The application to manage the list of Users.
var UserList = React.createClass({
    // Rendering the user list.
    render: function () {
        if (this.props.users === null) {
            return (
                <h3 className="text-center">Loading...</h3>
            );
        } else if (this.props.users.length === 0) {
            return (
                <h3 className="text-center">No users.</h3>
            );
        } else {
            var users = [];
            for (var i = 0; i < this.props.users.length; i++)
                users.push(<User user={this.props.users[i]}
                                 key={i} />);

            return (
                <div className="user-list">
                    {users}
                </div>
            );
        }
    }
});

// A parent app that wraps around the chat and user list.
var ChatApp = React.createClass({
    // Getting the initial state and defining the schema for the rest of the
    // application.
    getInitialState: function() {
        return {
            connected: true,
            messages: [],
            users: null
        };
    },

    // Setting up socket messaging after the component has been mounted.
    componentDidMount: function () {
        // Actual socket events.
        socket.on('message'       , this.newMessage);
        socket.on('userconnect'   , this.userConnect);
        socket.on('userdisconnect', this.userDisconnect);

        // Maintaining connection state.
        socket.on('disconnect'    , function () { this.setState({ connected: false }); }.bind(this));

        socket.on('connect', function () {
            this.setState({ connected: true });

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

                    this.setState({
                        connected: true,
                        users: users
                    });

                    var auth = Cookies.get('auth');
                    socket.emit('register', auth);
                }.bind(this)
            });
        }.bind(this));
    },

    // Functionality to represent a disconnection from the server.
    disconnect: function () {
        console.log('Lost contact to server.');
    },

    // Adding a new message to the list of messages.
    newMessage: function (message) {
        var tmp = this.state.messages;
        tmp.push(message);
        this.setState({ messages: tmp });
    },

    // Removing a user from the set of users when they connect.
    userConnect: function (username) {
        if (this.state.users !== null) {
            var tmp = this.state.users;
            tmp.push(username);

            this.setState({ users: tmp });
        }
    },

    // Removing a user from the set of users when they disconnect.
    userDisconnect: function (username) {
        if (this.state.users !== null) {
            var tmp = this.state.users;
            for (var i = 0; i < tmp.length; i++) {
                if (username === tmp[i].username) {
                    tmp.splice(i, 1);
                    break;
                }
            }

            this.setState({ users: tmp });
        }
    },

    // Rendering the whole app.
    render: function () {
        return (
            <div className="max-height">
                <div id="leftPane" className="col-xs-12 col-sm-8 col-md-8 col-lg-10">
                    <Chat connected={this.state.connected}
                          messages={this.state.messages} />
                </div>

                <div id="rightPane" className="col-xs-12 col-sm-4 col-md-4 col-lg-2">
                    <UserList connected={this.state.connected}
                              users={this.state.users} />
                </div>
            </div>
        );
    }
});

// Adding the series of React components.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<ChatApp />, document.getElementById('chatApp'));
});
