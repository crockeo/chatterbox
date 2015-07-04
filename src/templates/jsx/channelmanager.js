// Name  : channelmanager.js
// Author: Cerek Hillen
//
// Description:
//   The front-end for rendering the channel management page.

// The main channel management app wrapper.
var ChannelManagement = React.createClass({
    render: function () {
        return (
            <h1>Hello world</h1>
        );
    }
});

// Rendering the ChannelManagement object upon the page being loaded.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<ChannelManagement />, document.getElementById('reactWrapper'));
});
