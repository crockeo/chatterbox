// Name  : main.js
// Author: Cerek Hillen
//
// Description:
//   The portion of this React application that is going to be running on every
//   single page.

//////////
// Code //

// The overlay for logging in.
var LoginApp = React.createClass({
    // Defining the initial schema for this app.
    getInitialState: function () {
        return {
            errorClass: '',
            error: ''
        };
    },

    // Attempting to submit login information.
    onSubmit: function (e) {
        e.preventDefault();

        var email    = this.refs.email.getDOMNode(),
            password = this.refs.password.getDOMNode(),
            remember = this.refs.remember.getDOMNode();

        makeRequest({
            method: 'POST',
            path: '/api/login',

            body: JSON.stringify({
                email   : email.value,
                password: password.value,
                remember: remember.checked
            }),

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            onload: function (response) {
                handleFormSubmit.bind(this)(response);

                var json = JSON.parse(response);
                setTimeout(function () {
                    if (json.success)
                        window.location = '/';
                }, GLOBAL_REDIRECT_TIME);
            }.bind(this)
        });
    },

    // Rendering the LoginApp.
    render: function () {
        return (
            <div className={'overlay-container ' + this.props.fadeClass}>
                <div onClick={this.props.exit} className="overlay-background"></div>

                <div className="overlay-form-container">
                    <h3>Login</h3>
                    <form onSubmit={this.onSubmit} className="overlay-form">
                        <label className={this.state.errorClass}>{this.state.error}</label>

                        <div className="form-group">
                            <input ref="email" className="form-control" type="email" placeholder="Enter email" required />
                        </div>

                        <div className="form-group">
                            <input ref="password" className="form-control" type="password" placeholder="Enter password" required />
                        </div>

                        <div className="form-group">
                            <label><input ref="remember" type="checkbox" /> Stay logged in?</label>
                        </div>

                        <button className="btn btn-default">Login</button>
                    </form>
                </div>
            </div>
        );
    }
});

// The overlay for registration.
var RegisterApp = React.createClass({
    // Defining the initial state for this appliaction.
    getInitialState: function () {
        return {
            errorClass: '',
            error: ''
        }
    },

    // Attempting to submit registration information.
    onSubmit: function (e) {
        e.preventDefault();

        var email     = this.refs.email.getDOMNode(),
            username  = this.refs.username.getDOMNode(),
            password  = this.refs.password.getDOMNode(),
            cpassword = this.refs.cpassword.getDOMNode();

        if (password.value !== cpassword.value) {
            this.setState({
                errorClass: 'text-warning',
                error: 'Passwords do not match.'
            })

            return;
        } else
            this.setState({ errorClass: '', error: '' });

        makeRequest({
            method: 'POST',
            path: '/api/register',

            body: JSON.stringify({
                email: email.value,
                username: username.value,
                password: password.value
            }),

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            onload: function (response) {
                handleFormSubmit.bind(this)(response);

                var json = JSON.parse(response);
                setTimeout(function () {
                    if (json.success)
                        window.location = '/';
                }, GLOBAL_REDIRECT_TIME);
            }.bind(this)
        });
    },

    // Rendering the RegisterApp.
    render: function () {
        return (
            <div className={'overlay-container ' + this.props.fadeClass}>
                <div onClick={this.props.exit} className="overlay-background"></div>

                <div className="overlay-form-container">
                    <h3>Register</h3>
                    <form onSubmit={this.onSubmit} className="overlay-form">
                        <label className={this.state.errorClass}>{this.state.error}</label>

                        <div className="form-group">
                            <input ref="email" className="form-control" type="email" placeholder="Enter email" required />
                        </div>

                        <div className="form-group">
                            <input ref="username" className="form-control" type="text" placeholder="Enter username" required />
                        </div>

                        <div className="form-group">
                            <input ref="password" className="form-control" type="password" placeholder="Enter password" required />
                        </div>

                        <div className="form-group">
                            <input ref="cpassword" className="form-control" type="password" placeholder="Confirm password" required />
                        </div>

                        <button className="btn btn-default">Register</button>
                    </form>
                </div>
            </div>
        );
    }
});

// Managing the login & register overlays.
var OverlayManager = React.createClass({
    render: function () {
        if (this.props.showLogin)
            return <LoginApp exit={this.props.exitLogin}
                             fadeClass={this.props.closeLogin ? 'fade-out' : 'fade-in'} />
        else if (this.props.showRegister)
            return <RegisterApp exit={this.props.exitRegister}
                                fadeClass={this.props.closeRegister ? 'fade-out' : 'fade-in'} />
        else
            return <span></span>
    }
});

// The login or logout entry on the top bar.
var LoginLinkApp = React.createClass({
    // Returning the initial state - effectively defining the schema for this
    // app.
    getInitialState: function () {
        return {
            logged: null,
            showLogin: false,
            closeLogin: false,
            showRegister: false,
            closeRegister: false
        };
    },

    // Checking whether or not the user is logged in after the component has
    // been mounted.
    componentDidMount: function () {
        checkLogged(function (logged) {
            this.setState({ logged: logged });
        }.bind(this));
    },

    // Exitting the login overlay.
    exitLogin: function () {
        this.setState({
            closeLogin: true
        });

        setTimeout(function () {
            this.setState({
                showLogin: false,
                closeLogin: false
            })
        }.bind(this), 100);
    },

    // Exiting the registration overlay.
    exitRegister: function () {
        this.setState({
            closeRegister: true
        });

        setTimeout(function () {
            this.setState({
                showRegister: false,
                closeRegister: false
            })
        }.bind(this), 100);
    },

    // Removing the authorization cookie and reloading the page.
    logout: function () {
        Cookies.set('auth', '');
        setTimeout(function () {
            window.location = '/';
        }, GLOBAL_REDIRECT_TIME);
    },

    // Rendering the login app.
    render: function () {
        if (this.state.logged === null) {
            return (
                <a className="top-bar-text secondary">...</a>
            )
        } else if (this.state.logged === false) {
            return (
                <span>
                    <OverlayManager showLogin={this.state.showLogin}
                                    closeLogin={this.state.closeLogin}
                                    exitLogin={this.exitLogin}
                                    showRegister={this.state.showRegister}
                                    closeRegister={this.state.closeRegister}
                                    exitRegister={this.exitRegister} />

                    <a onClick={function () { this.setState({ showLogin: true }); }.bind(this)} href="#" className="top-bar-text secondary">Login</a>
                    <a onClick={function () { this.setState({ showRegister: true }); }.bind(this)} href="#" className="top-bar-text secondary">Register</a>
                </span>
            );
        } else if (this.state.logged === true) {
            return (
                <span>
                    <a href="/profile.html" className="top-bar-text secondary">Profile</a>
                    <a onClick={this.logout} href='#' className="top-bar-text secondary">Logout</a>
                </span>
            );
        }
    }
});

// Adding the series of React components.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<LoginLinkApp />, document.getElementById('loginWrapper'));
});
