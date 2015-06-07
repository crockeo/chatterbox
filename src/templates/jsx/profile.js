// Name  : profile.js
// Author: Cerek Hillen
//
// Description:
//   The React app for the profile page. Predominantly designed around being
//   able to function around any block of user data.

//////////
// Code //

// Doing the primary rendering & page interaction for the profile page.
var ProfilePage = React.createClass({
    // Running some piece of code when the update profile form is submitted.
    onSubmit: function (e) {
        e.preventDefault();


    },

    // Setting the initial values of the form.
    componentDidMount: function () {
        if (this.props.yours) {
            this.refs.username.getDOMNode().value = this.props.user.username;
            this.refs.email   .getDOMNode().value = this.props.user.email;
        }
    },

    render: function () {
        // Setting the right side depending on whether or not the profile is
        // yours.
        var rightSide;
        if (this.props.yours) {
            rightSide = (
                <div className="right-bar">
                    <h2>Update Your Profile</h2>

                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input ref="username" className="form-control" type="text" placeholder="New username." />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input ref="email" className="form-control" type="email" placeholder="New email." />
                        </div>

                        <div className="form-group">
                            <label>Change Password</label>
                            <input ref="npassword" className="form-control" type="password" placeholder="New password." />
                        </div>

                        <div className="form-group">
                            <input ref="cnpassword" className="form-control" type="password" placeholder="Confirm new password." />
                        </div>

                        <div className="form-group">
                            <label>Change Profile Picture</label>
                            <h4>TODO: Actually implement this lol</h4>
                        </div>

                        <div className="form-group">
                            <label>Authenticate</label>
                            <input ref="password" className="form-control" type="password" placeholder="Current password." />
                        </div>

                        <button className="btn btn-default" type="submit">Update Profile</button>
                    </form>
                </div>
            );
        } else {
            rightSide = (
                <div className="right-bar">
                    <h2>RAWR</h2>
                </div>
            );
        }

        return (
            <div className="max-height">
                <div className="left-bar">
                    <span className="profile-container">
                        <img src={'/static/img/profiles/' + this.props.user.picture}
                             alt={this.props.user.profile}
                             className="profile-picture" />

                        <h3 className="text-center">{this.props.user.username}&#39;s Profile</h3>
                    </span>
                </div>

                {rightSide}
            </div>
        );
    }
});

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
        else
            return <ProfilePage user={this.state.responseData.user} yours={this.state.yours} />
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
