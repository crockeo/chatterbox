// Name  : main.js
// Author: Cerek Hillen
//
// Description:
//   The portion of this React application that is going to be running on every
//   single page.

//////////
// Code //

// The login or logout entry on the top bar.
var LoginLinkApp = React.createClass({
    getInitialState: function () {
        return {
            logged: null
        };
    },

    componentDidMount: function () {
        checkLogged(function (logged) {
            this.setState({ logged: logged });
        }.bind(this));
    },

    render: function () {
        if (this.state.logged === null) {
            return (
                <a className="top-bar-text secondary">...</a>
            )
        } else if (this.state.logged === false) {
            return (
                <span>
                    <a href="/login.html" className="top-bar-text secondary">Login</a>
                    <a href="/register.html" className="top-bar-text secondary">Register</a>
                </span>
            );
        } else if (this.state.logged === true) {
            return (
                <a onclick={this.logout} className="top-bar-text secondary">Logout</a>
            );
        }
    }
});

// Adding the series of React components.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<LoginLinkApp />, document.getElementById('loginWrapper'));
});
