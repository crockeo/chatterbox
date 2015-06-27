// Name  : users.js
// Author: Cerek Hillen
//
// Description:
//   Listing the users on the chat page.

//////////
// Code //

withGlobal(function (global) {
    // The React class to display a single user.
    var User = React.createClass({
        // Rendering this user.
        render: function () {
            return (
                <div className="user-list-row">
                    <a href={'/profile.html?username=' + this.props.user.username}>
                        <img src={'/api/image?id=' + this.props.user.picture}
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

    global.UserList = UserList;
});
