// Name  : register.js
// Author: Cerek Hillen
//
// Description:
//   The front-end application for the portion of the app dedicated to
//   registering new users.

//////////
// Code //

// The registration app itself.
var RegisterApp = React.createClass({
    // Handling a form submission.
    onSubmit: function (e) {
        e.preventDefault();

        var email     = this.refs.email.getDOMNode(),
            username  = this.refs.username.getDOMNode(),
            password  = this.refs.password.getDOMNode(),
            cpassword = this.refs.cpassword.getDOMNode();

        makeRequest({
            method: 'POST',
            path: '/api/register',

            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                cpassword: cpassword
            }),

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            onload: function (response) {
                console.log(response);
            }.bind(this)
        });
    },

    // Getting the initial state of the registration app.
    getInitialState: function () {
        return { errorClass: '', error: '' };
    },

    // Rendering the register app.
    render: function () {
        return (
            <form className="col-xs-12 col-sm-12 col-md-10       col-lg-8
                                                 col-md-offset-1 col-lg-offset-2" onSubmit={this.onSubmit}>
                <label className={this.state.errorClass} ref="error">{this.state.error}</label>

                <div className="form-group">
                    <input className="form-control" ref="email" type="email" placeholder="Enter email." required />
                </div>

                <div className="form-group">
                    <input className="form-control" ref="username" type="text" placeholder="Enter username." required />
                </div>

                <div className="form-group">
                    <input className="form-control" ref="password" type="password" placeholder="Enter password." required />
                </div>

                <div className="form-group">
                    <input className="form-control" ref="cpassword" type="password" placeholder="Confirm password." required />
                </div>

                <button className="btn btn-default" type="submit">Register</button>
            </form>
        );
    }
});

document.addEventListener('DOMContentLoaded', function () {
    React.render(<RegisterApp />, document.getElementById('registerApp'));
});
