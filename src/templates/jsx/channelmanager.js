// Name  : channelmanager.js
// Author: Cerek Hillen
//
// Description:
//   The front-end for rendering the channel management page.

//////////
// Code //

withGlobal(function (global) {
    // Displaying an authorization type.
    function displayAuthType(authType) {
        switch (authType) {
            case 'open':     return 'open';
            case 'password': return 'password protected';
            case 'invite':   return 'invite only';
            default:         return 'ERROR - No such auth type should exist: ' + authType;
        }
    }

    // Displaying an authorization level.
    function displayAuthLevel(authLevel) {
        switch (authLevel) {
            case 0:  return 'Admin';
            case 1:  return 'Moderator';
            case 2:  return 'User';
            case 3:  return 'Non-User';
            default: return 'ERROR - No such auth level should exist: ' + authLevel;
        }
    }

    // A single user in the userlist of IntViewPanel.
    var User = React.createClass({
        // Defining the required properties.
        propTypes: {
            authLevel: React.PropTypes.number,
            username:  React.PropTypes.string,
            admin:     React.PropTypes.bool
        },

        // Getting the initial state of the user.
        getInitialState: function () {
            return { editing: false };
        },

        // Submitting whatever changes to a user.
        submitChanges: function () {

        },

        // Going into edit-user mode.
        toggleEdit: function () {
            this.setState({ editing: !this.state.editing });
        },

        // Rendering the user.
        render: function () {
            if (this.state.editing) {
                return (
                    <div className="user">
                        <span className="user-edit" onClick={this.submitChanges}>Submit</span>
                        <span className="user-edit" onClick={this.toggleEdit}>Back</span>
                    </div>
                );
            } else {
                return (
                    <div className="user">
                        <span className="user-name">{this.props.username}</span>
                        <span className="user-authLevel"> - {displayAuthLevel(this.props.authLevel)}</span>
                        {this.props.admin ? <span className="user-edit" onClick={this.toggleEdit}>Edit</span> : <span></span>}
                    </div>
                );
            }
        }
    });

    // Displaying a page to a user who should have internal information to a
    // channel.
    //
    // If the user has the proper authorization levels, it will also display
    // the option to edit appropriate values.
    var IntViewPanel = React.createClass({
        // Defining the required properties.
        propTypes: {
            channelInfo: React.PropTypes.object
        },

        // Rendering the internal view type.
        render: function () {
            var admin    = this.props.channelInfo.authLevel < 2,
                userlist = [];

            for (var i = 0; i < this.props.channelInfo.users.length; i++)
                userlist.push(<User authLevel={this.props.channelInfo.users[i].authLevel}
                                    username={this.props.channelInfo.users[i].username}
                                    admin={admin}
                                    key={i} />);

            console.log(this.props.channelInfo);
            return (
                <div>
                    <div className="intview-left">
                        <h3>You are {this.props.channelInfo.authLevel === 0 ? 'an' : 'a'} {displayAuthLevel(this.props.channelInfo.authLevel)}.</h3>
                        <h3>
                            {this.props.channelInfo.name} is {displayAuthType(this.props.channelInfo.authType)}. {this.props.channelInfo.authLevel < 2 ? <span className="edit-authType">Change</span> : <span></span>}
                        </h3>
                    </div>

                    <div className="intview-right">
                        <h3>Users</h3>
                        <div className="intview-userlist">
                            {userlist}
                        </div>
                    </div>
                </div>
            );
        }
    });

    // Displaying a page to a user who should be shown external information to
    // a channel.
    var ExtViewPanel = React.createClass({
        // Defining the required properties.
        propTypes: {
            channelInfo: React.PropTypes.object
        },

        // Rendering the external view type.
        render: function () {
            console.log(this.props.channelInfo);
            return (
                <h3 className="text-center">You cannot view {this.props.channelInfo.name} info: {this.props.channelInfo.name} is {displayAuthType(this.props.channelInfo.authType)}.</h3>
            );
        }
    });

    // The actual display panel for the channel manager.
    var ManagementPanel = React.createClass({
        // Defining the required properties.
        propTypes: {
            channelInfo: React.PropTypes.object
        },

        // Rendering the ManagementPanel.
        render: function () {
            var panel;
            if (this.props.channelInfo.full)
                panel = <IntViewPanel channelInfo={this.props.channelInfo} />;
            else
                panel = <ExtViewPanel channelInfo={this.props.channelInfo} />;

            return (
                <div className="channelinfo-background">
                    <div className="container channelinfo-foreground">
                        <h2 className="text-center">{this.props.channelInfo.name} Info</h2>

                        {panel}
                    </div>
                </div>
            );
        }
    });

    // Utilities to view and manage channels.
    var ChannelManager = React.createClass({
        // Defining the required properties.
        propTypes: {
            channel: React.PropTypes.string
        },

        // Defining the channel schema.
        getInitialState: function () {
            return {
                channelInfo: null,
                exists:      false,
                loaded:      false
            };
        },

        // Loading the channel information after the component mounts.
        componentDidMount: function () {
            if (this.props.channel === undefined || this.props.channel === '') {
                this.setState({
                    exists: false,
                    loaded: true
                });

                return;
            }

            makeRequest({
                method: 'GET',
                path: '/api/channel/info?channel=' + this.props.channel,

                headers: {
                    'Accept': 'application/json'
                },

                onload: function (response) {
                    var json;

                    try       { json = JSON.parse(response); }
                    catch (e) { return console.log('Failed to parse response: "' + String(e) + '"'); }

                    this.setState({
                        channelInfo: !json.exists ? null : {
                            name:      json.name,
                            authType:  json.authType,
                            authLevel: json.authLevel,
                            users:     json.users,
                            full:      json.full
                        },

                        exists: json.exists,
                        loaded: true
                    });
                }.bind(this)
            });
        },

        render: function () {
            if (!this.state.loaded)
                return <h1 className="text-center">Loading...</h1>
            else if (!this.state.exists)
                return <h1 className="text-center">Failed to load channel data: No such channel exists.</h1>;
            else
                return <ManagementPanel channelInfo={this.state.channelInfo} />
        }
    });

    // Rendering the ChannelManager object upon the page being loaded.
    document.addEventListener('DOMContentLoaded', function () {
        React.render(
            <ChannelManager channel={getQueryParam('channel')} />,
            document.getElementById('reactWrapper')
        );
    });
});

//withGlobal(function (global) {
    //// A form to change the authorization type of a channel.
    //var ChangeAuthForm = React.createClass({
        //getInitialState: function () {
            //return {
                //passwordGroupClass: ' hidden',
                //errorClass: '',
                //error: ''
            //};
        //},

        //// Making sure that the proper value is selected by default.
        //componentDidMount: function () {
            //this.refs.newAuth.getDOMNode().value = this.props.authType;
            //this.checkPasswordGroupClass();
        //},

        //// Trying to submit a new authorization type for a channel.
        //onSubmit: function (e) {
            //e.preventDefault();

            //var newAuth     = this.refs.newAuth.getDOMNode(),
                //newPassword = this.refs.newPassword.getDOMNode();

            //// Constructing the request data.
            //var json = {
                //channel: this.props.channel,
                //newAuth: newAuth.value
            //};

            //if (newPassword.value.trim() !== '')
                //json.newPassword = newPassword.value.trim();

            //// Trying to change the authtype.
            //makeRequest({
                //method: 'POST',
                //path: '/api/channel/authtype',

                //headers: {
                    //'Content-Type': 'application/json',
                    //'Accept': 'application/json'
                //},

                //body: JSON.stringify(json),

                //onload: function (response) {
                    //handleFormSubmit.bind(this)(response);

                    //var json;
                    //try { json = JSON.parse(response); }
                    //catch (e) {
                        //console.log('Failed to parse /api/channel/authtype response.');
                        //return;
                    //}

                    //if (json.success)
                        //this.refs.newPassword.getDOMNode().value = '';
                //}.bind(this)
            //});
        //},

        //// Checking & possibly updating the passwordGroupClass.
        //checkPasswordGroupClass: function () {
            //if (this.refs.newAuth.getDOMNode().value === 'password')
                //this.setState({ passwordGroupClass: '' });
            //else
                //this.setState({ passwordGroupClass: ' hidden' });
        //},

        //// Rendering out this form.
        //render: function () {
            //return (
                //<form onSubmit={this.onSubmit}>
                    //<label className={this.state.errorClass}>{this.state.error}</label>
                    //<div className="form-group">
                        //<label>Authorization Type</label><br />
                        //<select onChange={this.checkPasswordGroupClass} ref="newAuth">
                            //<option value="open">Open</option>
                            //<option value="password">Password</option>
                            //<option value="invite">Invite</option>
                        //</select>
                    //</div>

                    //<div className={'form-group' + this.state.passwordGroupClass}>
                        //<input ref="newPassword" type="text" className="form-control" placeholder="Enter new channel password." />
                    //</div>

                    //<button className="btn btn-default">Submit</button>
                //</form>
            //);
        //}
    //});

    //// A form specifically made to invite users.
    //var InviteUserForm = React.createClass({
        //// Defining the form schema.
        //getInitialState: function () {
            //return {
                //errorClass: '',
                //error: ''
            //};
        //},

        //// Trying to submit an invite request for a user to a given channel.
        //onSubmit: function (e) {
            //e.preventDefault();

            //var username = this.refs.username.getDOMNode();

            //makeRequest({
                //method: 'POST',
                //path: '/api/invite',

                //headers: {
                    //'Content-Type': 'application/json',
                    //'Accept': 'application/json'
                //},

                //body: JSON.stringify({
                    //username: username.value,
                    //channel : this.props.channel
                //}),

                //onload: function (response) {
                    //handleFormSubmit.bind(this)(response);

                    //var json;
                    //try { json = JSON.parse(response); }
                    //catch (e) {
                        //console.log('Failed to parse /api/invite response.');
                        //return;
                    //}

                    //if (json.success) {
                        //username.value = '';
                        //setTimeout(function () {
                            //window.location = window.location;
                        //}, GLOBAL_REDIRECT_TIME);
                    //}
                //}.bind(this)
            //});
        //},

        //// Rendering the invite form.
        //render: function () {
            //return (
                //<form onSubmit={this.onSubmit}>
                    //<label className={this.state.errorClass}>{this.state.error}</label>

                    //<div className="form-group">
                        //<input ref="username" className="form-control" type="text" placeholder="Enter username." required />
                    //</div>

                    //<button className="btn btn-default" type="submit">Invite</button>
                //</form>
            //);
        //}
    //});

    //// Rendering a whole bunch of users at once.
    //var UsersRender = React.createClass({
        //render: function () {
            //var users = [];
            //for (var i = 0; i < this.props.users.length; i++) {
                //users.push(
                    //<tr key={i}>
                        //<td>{this.props.users[i].username}</td>
                        //<td>{this.props.users[i].authLevel}</td>
                    //</tr>
                //);
            //}

            //return (
                //<table className="table table-striped table-bordered">
                    //<tr>
                        //<th>Username</th>
                        //<th>Auth Level</th>
                    //</tr>

                    //<tbody className="user-table">
                        //{users}
                    //</tbody>
                //</table>
            //);
        //}
    //});

    //// A class to represent an option for the chat channel.
    //var ChatOption = React.createClass({
        //// Defining the schema of the chat.
        //getInitialState: function () {
            //return {
                //toggled: false
            //};
        //},

        //// Toggling the portion of the ChatOption that's under the 'togglePortion'.
        //toggle: function () {
            //this.setState({ toggled: !this.state.toggled });
        //},

        //// Determining if the toggle-able section ought to be shown or not.
        //shouldShow: function () {
            //return 'chat-option-toggle' + (this.state.toggled ? '' : ' hidden');
        //},

        //// Calculating the direction the toggle button should be facing.
        //toggleDirection: function () {
            //return 'glyphicon glyphicon-menu-' + (this.state.toggled ? 'up' : 'down');
        //},

        //// Rendering out the ChatOption.
        //render: function () {
            //var toggleButton;
            //if (this.props.canExpand)
                //toggleButton = <h4 className="chat-option-change" onClick={this.toggle}><span className={this.toggleDirection()}></span></h4>;
            //else
                //toggleButton = <span></span>

            //return (
                //<div className="chat-option">
                    //<h4>{this.props.prefix}: <code>{this.props.value}</code></h4>

                    //<div className={this.shouldShow()}>
                        //{this.props.children}
                    //</div>

                    //{toggleButton}
                //</div>
            //);
        //}
    //});

    //// Displaying the chat channel manager if you did receive full informtaion.
    //var ChannelManager = React.createClass({
        //render: function () {
            //return (
                //<div className="container">
                    //<h2>{this.props.info.name}</h2>

                    //<ChatOption value={this.props.info.authType}
                                //prefix="Authorization Type"
                                //canExpand={true}>
                        //<ChangeAuthForm authType={this.props.info.authType}
                                        //channel={this.props.channel} />
                    //</ChatOption>

                    //<ChatOption value={String(this.props.info.exists)}
                                //canExpand={false}
                                //prefix="Exists" />

                    //<ChatOption value={String(this.props.info.users.length)}
                                //canExpand={true}
                                //prefix="Users">
                        //<InviteUserForm channel={this.props.channel} />

                        //<hr className="dark-hr" />

                        //<UsersRender users={this.props.info.users} />
                    //</ChatOption>

                    //<ChatOption value={String(this.props.info.full)}
                                //canExpand={false}
                                //prefix="Full" />
                //</div>
            //);
        //}
    //});

    //// Displaying chat channel info if you didn't receive the full information.
    //var ChannelInfo = React.createClass({
        //render: function () {
            //return (
                //<div className="container">
                    //<h2>Channel</h2>
                    //<h3>Name: {this.props.info.name}</h3>
                    //<h3>Auth Type: {this.props.info.authType}</h3>
                    //<h3>Exists: {String(this.props.info.exists)}</h3>
                    //<h3>Full: {String(this.props.info.full)}</h3>

                    //<h2>Not authorized to see users.</h2>
                //</div>
            //);
        //}
    //});

//});
