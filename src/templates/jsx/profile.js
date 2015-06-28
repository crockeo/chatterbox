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
    // Getting the initial schema of the profile page.
    getInitialState: function () {
        return { errorClass: '', error: '' };
    },

    // Attempting to upload an image to the server - calling the callback
    // function with the appropriate information.
    uploadImage: function (image, callback) {
        if (image.size > 1024 * 100) {
            handleFormSubmitJSON.bind(this)({
                error  : false,
                success: false,
                message: 'Max image size is 100KB.'
            });

            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            makeRequest({
                method: 'POST',
                path: '/api/image',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept'      : 'application/json'
                },

                body: JSON.stringify({
                    contentType: image.type,
                    data       : e.target.result
                }),

                onprogress: function (response) {
                    // TODO: Manage a progress bar or something?
                }.bind(this),

                onload: function (response) {
                    var json;
                    try { json = JSON.parse(response); }
                    catch (e) {
                        handleFormSubmitJSON.bind(this)({
                            error  : true,
                            success: false,
                            message: 'Failed to parse server response.'
                        });

                        return;
                    }

                    callback(json);
                }.bind(this)
            });
        };

        reader.readAsBinaryString(image);
    },

    // Updating the profile
    updateProfile: function (response) {
        var username   = this.refs.username.getDOMNode(),
            email      = this.refs.email.getDOMNode(),
            npassword  = this.refs.npassword.getDOMNode(),
            cnpassword = this.refs.cnpassword.getDOMNode(),
            password   = this.refs.password.getDOMNode();

        if (response !== undefined && (response.error || !response.success)) {
            handleFormSubmitJSON.bind(this)(response);
            return;
        }

        makeRequest({
            method: 'POST',
            path  : '/api/user',

            body: JSON.stringify({
                auth    : Cookies.get('auth'),
                password: password.value,

                update: {
                    username : username.value === this.props.user.username || username.value === '' ? undefined : username.value,
                    email    : email.value    === this.props.user.email    || email.value    === '' ? undefined : email.value,
                    npassword: npassword.value,
                    picture  : response === undefined ? undefined : response.id
                }
            }),

            headers: {
                'Content-Type': 'application/json',
                'Accept'      : 'application/json'
            },

            onload: function (response) {
                handleFormSubmit.bind(this)(response);

                var json = JSON.parse(response);
                setTimeout(function () {
                    if (json.success)
                        window.location = '/profile.html';
                }, GLOBAL_REDIRECT_TIME);
            }.bind(this)
        });
    },

    // Running some piece of code when the update profile form is submitted.
    onSubmit: function (e) {
        e.preventDefault();

        var picture    = this.refs.picture.getDOMNode(),
            npassword  = this.refs.npassword.getDOMNode(),
            cnpassword = this.refs.cnpassword.getDOMNode();

        // Making sure that the new passwords match.
        if (npassword.value !== cnpassword.value) {
            handleFormSubmitJSON.bind(this)({
                error  : false,
                success: false,
                message: 'Passwords do not match.'
            });

            return;
        }

        // Only updating the profile if no picture is selected.
        if (picture.files.length === 0)
            return this.updateProfile();

        // Making sure you only pick a single file.
        if (picture.files.length > 1) {
            return handleFormSubmitJSON.bind(this)({
                error  : false,
                success: false,
                message: 'You can only select a single file.'
            });
        }

        this.uploadImage(picture.files[0], this.updateProfile);
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
                        <label className={this.state.errorClass}>{this.state.error}</label>

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
                            <input ref="picture" type="file" />
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
                        <img src={'/api/image?id=' + this.props.user.picture}
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
