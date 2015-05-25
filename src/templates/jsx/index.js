// Name  : index.js
// Author: Cerek Hillen
//
// Description:
//   The portion of this React application that is going to be running on every
//   single page.

// The Chat portion of the application.
var Chat = React.createClass({
    render: function () {
        return (
            <h1>Left pane</h1>
        );
    }
});

// The application to manage the list of Users.
var UserList = React.createClass({
    render: function () {
        return (
            <h1>Right pane</h1>
        );
    }
})

// Adding the series of React components.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<Chat />, document.getElementById('chatApp'));
    React.render(<UserList />, document.getElementById('userListApp'));
});
