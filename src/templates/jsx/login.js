// Name  : login.js
// Author: Cerek Hillen
//
// Description:
//   The UI for logging into the application.

//////////
// Code //

// The front-end app for logging in.
var LoginApp = React.createClass({
    // Handling for submission.
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

    // Getting the initial state of the login app.
    getInitialState: function () {
        return {
            errorClass: '',
            logged: null,
            error: ''
        };
    },

    // Attempting to ascertain the status of whether or not the user is logged
    // in.
    componentDidMount: function () {
        checkLogged(function (logged) {
            this.setState({ logged: logged });
        }.bind(this));
    },

    // Rendering the login app.
    render: function () {
        if (this.state.logged === null) {
            return <h3 className="text-center">...</h3>
        } else if (this.state.logged) {
            return <h3 className="text-center">You must log out before you log back in.</h3>
        } else {
            return (
                <form className="col-xs-12 col-sm-12 col-md-10       col-lg-8
                                                     col-md-offset-1 col-lg-offset-2" onSubmit={this.onSubmit}>
                    <label className={this.state.errorClass}>{this.state.error}</label>

                    <div className="form-group">
                        <input className="form-control" ref="email" type="email" placeholder="Enter email." required />
                    </div>

                    <div className="form-group">
                        <input className="form-control" ref="password" type="password" placeholder="Enter password." required />
                    </div>

                    <div className="form-group">
                        <label><input ref="remember" type="checkbox" /> Stay logged in?</label>
                    </div>

                    <button className="btn btn-default" type="submit">Login</button>
                </form>
            );
        }
    }
});

// Registering the login app.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<LoginApp />, document.getElementById('loginApp'));
});
