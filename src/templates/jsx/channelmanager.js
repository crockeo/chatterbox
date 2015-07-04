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

            if (this.state.channelInfo.full) {
                var users = [];
                for (var i = 0; i < this.state.channelInfo.users.length; i++)
                    users.push(<UserRender info={this.state.channelInfo.users[i]} key={i} />);

                return (
                    <div className="container">
                        <h2>Channel</h2>
                        <h3>Name: {this.state.channelInfo.name}</h3>
                        <h3>Auth Type: {this.state.channelInfo.authType}</h3>
                        <h3>Exists: {String(this.state.channelInfo.exists)}</h3>
                        <h3>Full: {String(this.state.channelInfo.full)}</h3>

                        {users}
                    </div>
                );
            }

            if (!this.state.channelInfo.full) {
                return (
                    <div className="container">
                        <h2>Channel</h2>
                        <h3>Name: {this.state.channelInfo.name}</h3>
                        <h3>Auth Type: {this.state.channelInfo.authType}</h3>
                        <h3>Exists: {String(this.state.channelInfo.exists)}</h3>
                        <h3>Full: {String(this.state.channelInfo.full)}</h3>

                        <h2>Not authorized to see users.</h2>
                    </div>
                );
            }
        }
    });

    // Rendering the ChannelManagement object upon the page being loaded.
    document.addEventListener('DOMContentLoaded', function () {
        var channel = getQueryParam('channel');

        React.render(<ChannelManagement channel={channel} />, document.getElementById('reactWrapper'));
    });
});
