// Name  : channelmanager.js
// Author: Cerek Hillen
//
// Description:
//   The front-end for rendering the channel management page.

withGlobal(function (global) {
    // A form specifically made to invite users.
    var InviteUserForm = React.createClass({
        // Defining the form schema.
        getInitialState: function () {
            return {
                errorClass: '',
                error: ''
            };
        },

        // Trying to submit an invite request for a user to a given channel.
        onSubmit: function (e) {
            e.preventDefault();

            var username = this.refs.username.getDOMNode();

            makeRequest({
                method: 'POST',
                path: '/api/invite',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },

                body: JSON.stringify({
                    username: username.value,
                    channel : this.props.channel
                }),

                onload: function (response) {
                    // TODO: Actually handle the response.
                    handleFormSubmit.bind(this)(response);
                    username.value = '';
                }.bind(this)
            });
        },

        // Rendering the invite form.
        render: function () {
            return (
                <form onSubmit={this.onSubmit}>
                    <label className={this.state.errorClass}>{this.state.error}</label>

                    <div className="form-group">
                        <input ref="username" className="form-control" type="text" placeholder="Enter username." required />
                    </div>

                    <button className="btn btn-default" type="submit">Invite</button>
                </form>
            );
        }
    });

    // Rendering a whole bunch of users at once.
    var UsersRender = React.createClass({
        render: function () {
            var users = [];
            for (var i = 0; i < this.props.users.length; i++) {
                users.push(
                    <tr key={i}>
                        <td>{this.props.users[i].username}</td>
                        <td>{this.props.users[i].authLevel}</td>
                    </tr>
                );
            }

            return (
                <table className="table table-striped table-bordered">
                    <tr>
                        <th>Username</th>
                        <th>Auth Level</th>
                    </tr>

                    <tbody>
                        {users}
                    </tbody>
                </table>
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
            var toggleButton;
            if (this.props.canExpand)
                toggleButton = <h4 className="chat-option-change" onClick={this.toggle}><span className={this.toggleDirection()}></span></h4>;
            else
                toggleButton = <span></span>

            return (
                <div className="chat-option">
                    <h4>{this.props.prefix}: <code>{this.props.value}</code></h4>

                    <div className={this.shouldShow()}>
                        {this.props.children}
                    </div>

                    {toggleButton}
                </div>
            );
        }
    });

    // Displaying the chat channel manager if you did receive full informtaion.
    var ChannelManager = React.createClass({
        render: function () {
            return (
                <div className="container">
                    <h2>{this.props.info.name}</h2>

                    <ChatOption value={this.props.info.authType}
                                prefix="Authorization Type"
                                canExpand={true}>
                        <h2>Nothing here yet!</h2>
                    </ChatOption>

                    <ChatOption value={String(this.props.info.exists)}
                                canExpand={false}
                                prefix="Exists" />

                    <ChatOption value={String(this.props.info.users.length)}
                                canExpand={true}
                                prefix="Users">
                        <InviteUserForm channel={this.props.channel} />

                        <hr className="dark-hr" />

                        <UsersRender users={this.props.info.users} />
                    </ChatOption>

                    <ChatOption value={String(this.props.info.full)}
                                canExpand={false}
                                prefix="Full" />
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
                return <ChannelManager info={this.state.channelInfo} channel={this.props.channel} />;
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
