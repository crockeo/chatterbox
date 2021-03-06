// Name  : main.js
// Author: Cerek Hillen
//
// Description:
//   The portion of this React application that is going to be running on every
//   single page.

//////////
// Code //

(function () {
    // The overlay for logging in.
    var LoginForm = React.createClass({
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
                <div>
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
            );
        }
    });

    // The overlay for registration.
    var RegisterForm = React.createClass({
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
                <div>
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
            );
        }
    });

    // Managing the login & register overlays.
    var OverlayManager = React.createClass({
        render: function () {
            return (
                <span>
                    <PageOverlay hideOverlay={this.props.hideLogin}
                                 show={this.props.showLogin}>
                        <LoginForm />
                    </PageOverlay>

                    <PageOverlay hideOverlay={this.props.hideRegister}
                                 show={this.props.showRegister}>
                        <RegisterForm />
                    </PageOverlay>
                </span>
            );
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
                showRegister: false,
            };
        },

        // Checking whether or not the user is logged in after the component has
        // been mounted.
        componentDidMount: function () {
            checkLogged(function (logged) {
                this.setState({ logged: logged });
            }.bind(this));
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
                        <OverlayManager hideLogin={function () { this.setState({ showLogin: false }); }.bind(this)}
                                        showLogin={this.state.showLogin}

                                        hideRegister={function () { this.setState({ showRegister: false }); }.bind(this)}
                                        showRegister={this.state.showRegister} />

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

    // The portion of the app dedicated to toggling out the rest of the menu in the
    // event that the screen size is too limited.
    var MenuToggleApp = React.createClass({
        getInitialState: function () {
            return { toggled: false };
        },

        doToggle: function () {
            if (this.state.toggled) {
                removeClass(document.getElementById('toggleBar'), 'toggle-on');
                addClass(document.getElementById('toggleBar'), 'toggle-off');
            } else {
                removeClass(document.getElementById('toggleBar'), 'toggle-off');
                addClass(document.getElementById('toggleBar'), 'toggle-on');
            }
        },

        onClick: function () {
            this.setState({ toggled: !this.state.toggled });
            this.doToggle();
        },

        render: function () {
            var span;
            if (this.state.toggled)
                span = <span className="glyphicon glyphicon-menu-up"></span>
            else
                span = <span className="glyphicon glyphicon-menu-down"></span>

            return (
                <button onClick={this.onClick} id="toggleButton" type="button">
                    {span}
                </button>
            );
        }
    });

    // Adding the series of React components.
    document.addEventListener('DOMContentLoaded', function () {
        React.render(<LoginLinkApp />, document.getElementById('loginWrapper'));
        React.render(<MenuToggleApp />, document.getElementById('menuToggleApp'));
    });
})();
