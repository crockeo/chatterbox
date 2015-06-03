// Name  : profile.js
// Author: Cerek Hillen
//
// Description:
//   The React app for the profile page. Predominantly designed around being
//   able to function around any block of user data.

//////////
// Code //

// The primary profile app.
var ProfileApp = React.createClass({
    // Defining the initial schema of the profile.
    getInitialState: function () {
        return { userData: null }
    },

    // Attempting to retrieve information about the user.
    componentDidMount: function () {
        makeRequest({
            method: 'GET',
            path: '/api/user?username=' + this.props.username,

            headers: {
                'Accept': 'application/json'
            },

            onload: function (response) {
                var json;
                try       { json = JSON.parse(response); }
                catch (e) { json = {};                   }

                this.setState({ userData: json });
            }.bind(this)
        });
    },

    // Rendering the ProfileApp.
    render: function () {
        if (this.props.username === null) {
            return (
                <h2 className="text-center">You must either be logged in or specify a user account.</h2>
            )
        } else {
            return (
                <h2>{this.props.username} - Nothing here mayne.</h2>
            );
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var username = getQueryParam('username');

    if (username == '') {
        try       { username = JSON.parse(Cookies.get('auth')).username; }
        catch (e) { username = null;                                     }
    }

    React.render(<ProfileApp username={username} />, document.getElementById('profileApp'));
});
