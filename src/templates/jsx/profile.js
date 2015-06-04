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
        return {
            responseData: null,
            yours: null
        };
    },

    // Attempting to retrieve information about the user.
    componentDidMount: function () {
        if (this.props.username !== null) {
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

                    if (json.user === undefined)
                        this.setState({ responseData: json });
                    else {
                        var auth = Cookies.get('auth');
                        try       { auth = JSON.parse(auth); }
                        catch (e) { auth = {};               }

                        this.setState({
                            responseData: json,
                            yours: auth !== {} && this.props.username === auth.username
                        });
                    }
                }.bind(this)
            });
        }
    },

    // Rendering the ProfileApp.
    render: function () {
        if (this.props.username === null)
            return <h2 className="text-center">You must either be logged in or specify a user account.</h2>
        else if (this.state.responseData === null)
            return <h2 className="text-center">...</h2>
        else if (this.state.responseData.user === undefined)
            return <h2 className="text-center">Failed to load user data: {this.state.responseData.message}</h2>
        else {
            return <h2 className="text-center">Fill in the rest.</h2>
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
