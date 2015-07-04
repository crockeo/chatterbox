// Name  : channelmanager.js
// Author: Cerek Hillen
//
// Description:
//   The front-end for rendering the channel management page.

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

        return (
            <div className="container">
                <h1>Nothing here</h1>
                <h2>{this.props.channel}</h2>
            </div>
        );
    }
});

// Rendering the ChannelManagement object upon the page being loaded.
document.addEventListener('DOMContentLoaded', function () {
    var channel = getQueryParam('channel');

    React.render(<ChannelManagement channel={channel} />, document.getElementById('reactWrapper'));
});
