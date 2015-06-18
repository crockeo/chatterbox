// Name  : main.js
// Author: Cerek Hillen
//
// Description:
//   The primary piece of Javascript that manages and renders the index page.

//////////
// Code //

withGlobal(function (global) {
    // A single tab of the chat application.
    var ChatTab = React.createClass({
        // Rendering the chat.
        render: function () {
            return (
                <div className="max-height">
                    <div id="leftPane" className="col-xs-12 col-sm-8 col-md-8 col-lg-10">
                        <Chat connected={this.props.connected}
                              messages={this.props.messages}
                              socket={this.props.socket} />
                    </div>

                    <div id="rightPane" className="col-xs-12 col-sm-4 col-md-4 col-lg-2">
                        <UserList connected={this.props.connected}
                                  users={this.props.users} />
                    </div>
                </div>
            );
        }
    });

    // A parent app that wraps around the chat and user list.
    var ChatApp = React.createClass({
        // Getting the initial state and defining the schema for the rest of the
        // application.
        getInitialState: function() {
            return {
                channel: 'system',
                connected: true,
                messages: { },
                users: { }
            };
        },

        // Setting up socket messaging after the component has been mounted.
        componentDidMount: function () {
            // Actual socket events.
            this.props.socket.on('message'       , this.newMessage);
            this.props.socket.on('userconnect'   , this.userConnect);
            this.props.socket.on('userdisconnect', this.userDisconnect);

            // Maintaining connection state.
            this.props.socket.on('disconnect', function () {
                this.setState({ connected: false });
            }.bind(this));

            this.props.socket.on('connect', function () {
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
                        this.props.socket.emit('register', auth);
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
            if (tmp[message.channel] === undefined)
                tmp[message.channel] = [message];
            else
                tmp[message.channel].push(message);

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

        // Adding a new tab to the list of tabs.
        addTab: function (name) {
            if (this.state.tabs.find(name) === -1) {
                var tmp = this.state.tabs;
                tmp.push(name);
                this.setState({
                    tabs: tmp
                });
            }
        },

        // Changing the current tab.
        selectTab: function (name) {
            return function () { this.setState({ channel: name }); }.bind(this);
        },

        // Removing a given tab.
        closeTab: function (name) {

        },

        // Rendering the whole app.
        render: function () {
            return (
                <div className="max-height">
                    <TabList setChannel={function (channel) { this.setState({ channel: channel }) }.bind(this)}
                             currentTab={this.state.channel}
                             socket={this.state.socket} />

                    <ChatTab messages={this.state.messages[this.state.channel] ? this.state.messages[this.state.channel] : []}
                             users={this.state.users[this.state.channel] ? this.state.users[this.state.channel] : []}
                             connected={this.state.connected}
                             channel={this.state.channel}
                             socket={this.props.socket} />
                </div>
            );
        }
    });

    // Adding the series of React components.
    document.addEventListener('DOMContentLoaded', function () {
        var socket = io();
        React.render(<ChatApp socket={socket} />, document.getElementById('chatApp'));
    });
});
