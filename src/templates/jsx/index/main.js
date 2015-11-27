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
                              channel={this.props.channel}
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
                this.props.socket.emit('register', Cookies.get('auth'));
            }.bind(this));

            // Being alerted of the registration being complete.
            this.props.socket.on('registered', function () {
                makeRequest({
                    method: 'GET',
                    path: '/api/channel/pref',

                    onload: function (response) {
                        var json;
                        try       { json = JSON.parse(response);    }
                        catch (e) { console.log(String(e)); return; }

                        // TODO: When I join right here it doesn't actually add me
                        //       to the list of users and I forget why. So go find
                        //       out.
                        for (var i = 0; i < json.channels.length; i++)
                            this.props.socket.emit('join', { name: json.channels[i] });

                        if (json.channel !== undefined)
                            this.changeChannel(json.channel);
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
        userConnect: function (data) {
            var tmp = this.state.users;
            if (this.state.users[data.channel] === undefined)
                tmp[data.channel] = [data.user];
            else
                tmp[data.channel].push(data.user);

            this.setState({ users: tmp });
        },

        // Removing a user from the set of users when they disconnect.
        userDisconnect: function (data) {
            if (this.state.users[data.channel] !== undefined) {
                var idx = 0;
                for (idx = 0; idx <= this.state.users[data.channel].length; idx++) {
                    if (idx == this.state.users[data.channel].length) {
                        idx = -1;
                        break;
                    }

                    if (data.username === this.state.users[data.channel][idx].username)
                        break;
                }

                if (idx !== -1) {
                    var tmp = this.state.users;
                    tmp[data.channel].splice(idx, 1);
                    this.setState({ users: tmp });
                }
            }
        },

        // Notifying the server when you change a channel (to keep it cached for
        // when you come back.
        changeChannel: function (channel) {
            this.setState({ channel: channel });
            this.props.socket.emit('change', channel);
        },

        // Functionality to run upon a new tab being added to the list of
        // current tabs.
        newTab: function (channel) {
            makeRequest({
                method: 'GET',
                path: '/api/channel/data?channel=' + channel,

                headers: { 'Accept': 'application/json' },

                onload: function (response) {
                    var json;

                    try { json = JSON.parse(response); }
                    catch (e) {
                        console.log('Failed to parse /api/channel/data?channel=' + channel + ' response:');
                        console.log('  ' + String(e));
                    }

                    if (json.success) {
                        var messages = this.state.messages,
                            users    = this.state.users;

                        messages[channel] = json.data.messages;
                        users[channel] = json.data.users;

                        this.setState({
                            messages: messages,
                            users   : users
                        });
                    }
                }.bind(this)
            });
        },

        // Rendering the whole app.
        render: function () {
            return (
                <div className="max-height">
                    <TabList setChannel={this.changeChannel}
                             currentTab={this.state.channel}
                             socket={this.props.socket}
                             newTab={this.newTab} />

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
