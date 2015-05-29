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
            password = this.refs.password.getDOMNode();

        makeRequest({
            method: 'POST',
            path: '/api/login',

            body: JSON.stringify({
                email   : email.value,
                password: password.value
            }),

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            onload: handleFormSubmit.bind(this)
        });
    },

    // Getting the initial state of the login app.
    getInitialState: function () {
        return { errorClass: '', error: '' };
    },

    // Rendering the login app.
    render: function () {
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

                <button className="btn btn-default" type="submit">Login</button>
            </form>
        );
    }
});

// Registering the login app.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<LoginApp />, document.getElementById('loginApp'));
});
