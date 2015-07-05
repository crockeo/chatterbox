// Name  : channelmanager.js
// Author: Cerek Hillen
//
// Description:
//   The front-end for rendering the channel management page.

withGlobal(function (global) {
    var UserRender = React.createClass({
        render: function () {
            return (
                <div>
                    <h2>Users</h2>
                    <h3>{this.props.info.username} - {this.props.info.authLevel}</h3>
                </div>
            );
        }
    });

    // A class to represent an option for the chat channel.
    var ChatOption = React.createClass({
        // Defining the schema of the chat.
        getInitialState: function () {
            return {
                toggled: false
            };
        },

        // Toggling the portion of the ChatOption that's under the 'togglePortion'.
        toggle: function () {
            this.setState({ toggled: !this.state.toggled });
        },

        // Determining if the toggle-able section ought to be shown or not.
        shouldShow: function () {
            return 'chat-option-toggle' + (this.state.toggled ? '' : ' hidden');
        },

        // Calculating the direction the toggle button should be facing.
        toggleDirection: function () {
            return 'glyphicon glyphicon-menu-' + (this.state.toggled ? 'up' : 'down');
        },

        // Rendering out the ChatOption.
        render: function () {
            return (
                <div className="chat-option">
                    <h4>{this.props.prefix}: <code>{this.props.value}</code></h4>

                    <div className={this.shouldShow()}>
                        {this.props.children}
                    </div>

                    <h4 className="chat-option-change" onClick={this.toggle}><span className={this.toggleDirection()}></span></h4>
                </div>
            );
        }
    });

    // Displaying the chat channel manager if you did receive full informtaion.
    var ChannelManager = React.createClass({
        render: function () {
            var users = [];
            for (var i = 0; i < this.props.info.users.length; i++)
                users.push(<UserRender info={this.props.info.users[i]} key={i} />);

            return (
                <div className="container">
                    <h2>{this.props.info.name}</h2>

                    <ChatOption prefix="Authorization Type" value={this.props.info.authType}>
                        <h2>Testing</h2>
                    </ChatOption>

                    <ChatOption prefix="Exists" value={String(this.props.info.exists)} />

                    <h2>Channel</h2>
                    <h3>Name: {this.props.info.name}</h3>
                    <h3>Auth Type: {this.props.info.authType}</h3>
                    <h3>Exists: {String(this.props.info.exists)}</h3>
                    <h3>Full: {String(this.props.info.full)}</h3>

                    {users}
                </div>
            );
        }
    });

    // Displaying chat channel info if you didn't receive the full information.
    var ChannelInfo = React.createClass({
        render: function () {
            return (
                <div className="container">
                    <h2>Channel</h2>
                    <h3>Name: {this.props.info.name}</h3>
                    <h3>Auth Type: {this.props.info.authType}</h3>
                    <h3>Exists: {String(this.props.info.exists)}</h3>
                    <h3>Full: {String(this.props.info.full)}</h3>

                    <h2>Not authorized to see users.</h2>
                </div>
            );
        }
    });

    // The main channel management app wrapper.
    var ChannelManagement = React.createClass({
        // Defining the initial schema of the app.
        getInitialState: function () {
            return {
                channelInfo: null
            };
        },

        // Performing functionality upon the ChannelManagement class mounting in the
        // DOM.
        componentDidMount: function () {
            if (this.props.channel === '') {
                this.setState({
                    channelInfo: {
                        exists: false
                    }
                });
            } else {
                makeRequest({
                    method: 'GET',
                    path: '/api/channelinfo?channel=' + this.props.channel,

                    headers: {
                        'Accept': 'application/json'
                    },

                    onload: function (response) {
                        var json;

                        try       { json = JSON.parse(response);                                          }
                        catch (e) { return console.log('Failed to parse response: "' + String(e)); + '"'; }

                        this.setState({
                            channelInfo: json
                        });
                    }.bind(this)
                });
            }
        },

        // Rendering this ChannelManagement screen.
        render: function () {
            if (this.state.channelInfo === null)
                return <h1 className="text-center">Loading...</h1>;
            else if (this.state.channelInfo.full)
                return <ChannelManager info={this.state.channelInfo} />;
            else if (!this.state.channelInfo.full)
                return <ChannelInfo info={this.state.channelInfo} />;
        }
    });

    // Rendering the ChannelManagement object upon the page being loaded.
    document.addEventListener('DOMContentLoaded', function () {
        var channel = getQueryParam('channel');

        React.render(<ChannelManagement channel={channel} />, document.getElementById('reactWrapper'));
    });
});
