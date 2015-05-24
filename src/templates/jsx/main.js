// Name  : main.js
// Author: Cerek Hillen
//
// Description:
//   The portion of this React application that is going to be running on every
//   single page.

//
var LoginApp = React.createClass({
    checkLogged: function () {
        var req = new XMLHttpRequest();

        // Using self = this as opposed to binding the function the below seeing
        // as I wish to have a reference to 'this' pointing at the response
        // object as well as 'self' pointing to the LoginApp.
        var self = this;

        req.onload = function () {
            var json = {};
            try {
                json = JSON.parse(this.responseText);
            } catch (e) {
                console.log(e);
                json.logged = false;
            }

            if (json.logged === true)
                self.setState({ logged: true });
            else
                self.setState({ logged: false });
        };

        req.open('GET', '/api/islogged');
        req.setRequestHeader('Accept', 'application/json');
        req.send();
    },

    getInitialState: function () {
        return {
            logged: null
        };
    },

    componentDidMount: function () {
        setTimeout(this.checkLogged, 0);
    },

    render: function () {
        if (this.state.logged === null) {
            return (
                <a className="top-bar-text secondary">...</a>
            )
        } else if (this.state.logged === false) {
            return (
                <a href="/login" className="top-bar-text secondary">Login</a>
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
    React.render(<LoginApp />, document.getElementById('loginWrapper'));
});
