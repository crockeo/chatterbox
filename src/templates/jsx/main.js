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
    // Returning the initial state - effectively defining the schema for this
    // app.
    getInitialState: function () {
        return {
            logged: null
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
        }, 500);
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
                    <a href="/login.html" className="top-bar-text secondary">Login</a>
                    <a href="/register.html" className="top-bar-text secondary">Register</a>
                </span>
            );
        } else if (this.state.logged === true) {
            return (
                <a onClick={this.logout} href='#' className="top-bar-text secondary">Logout</a>
            );
        }
    }
});

// Adding the series of React components.
document.addEventListener('DOMContentLoaded', function () {
    React.render(<LoginLinkApp />, document.getElementById('loginWrapper'));
});
