// Name  : tabs.js
// Author: Cerek Hillen
//
// Description:
//   The portion of the app that manages the tabs. Client-side, it's the bar on
//   top of the chat screen.

//////////
// Code //

withGlobal(function (global) {
    // Rendering a specific tab element.
    var TabElement = React.createClass({
        // Rendering the current TabElement.
        render: function () {
            var c = this.props.selected ? 'tab-element selected' : 'tab-element';
            if (this.props.name === 'system' || !this.props.selected) {
                return (
                    <span className={c} onClick={this.props.selectTab(this.props.name)}>
                        <span className="tab-element-name">{this.props.name}</span>
                    </span>
                );
            } else {
                return (
                    <span className={c} onClick={this.props.selectTab(this.props.name)}>
                        <span className="tab-element-name">{this.props.name}</span>
                        <a href={'/channelmanager.html?channel=' + this.props.name} onClick={this.preventNav}><span className="tab-element-close glyphicon glyphicon-cog"></span></a>
                        <span className="tab-element-close glyphicon glyphicon-remove" onClick={this.props.closeTab(this.props.name)}></span>
                    </span>
                );
            }
        }
    });

    // The form for attempting to add a new channel.
    var NewTabForm = React.createClass({
        // Defining the class schema.
        getInitialState: function () {
            return {
                errorClass: '',
                error: ''
            };
        },

        // Registering some socket listeners upon this component mounting.
        componentDidMount: function () {
            this.props.socket.on('joinerr', function (response) {
                this.setState({
                    errorClass: response.err ? 'text-danger' : 'text-warning',
                    error     : response.message

                });
            }.bind(this));

            this.props.socket.on('join', function (response) {
                this.setState({
                    errorClass: 'text-success',
                    error     : 'Successfully joined a channel.'
                });

                this.props.hideOverlay();
            }.bind(this));
        },

        // Clearing the errorClass and error before it's being shown.
        componentWillReceiveProps: function (nextProps) {
            if (nextProps.show) {
                this.setState({
                    errorClass: '',
                    error: ''
                });
            }
        },

        // Attempting to join a new channel (with a given password).
        onSubmit: function (e) {
            e.preventDefault();

            this.props.socket.emit('join', {
                name    : this.refs.channel.getDOMNode().value,
                password: this.refs.password.getDOMNode().value
            });
        },

        // Rendering the NewTabForm.
        render: function () {
            return (
                <div>
                    <h3>Join Channel</h3>
                    <form onSubmit={this.onSubmit}>
                        <label className={this.state.errorClass}>{this.state.error}</label>

                        <div className="form-group">
                            <input placeholder="Enter channel name."
                                className="form-control"
                                ref="channel"
                                type="text" />
                        </div>

                        <div className="form-group">
                            <input placeholder="Enter password (optional)"
                                className="form-control"
                                type="password"
                                ref="password" />
                        </div>

                        <button className="btn btn-default">Join</button>
                    </form>
                </div>
            );
        }
    });

    // The bar atop the chat messages that lists currently open tabs.
    var TabList = React.createClass({
        // Defining the schema of the TabList state along w/ default tabs.
        getInitialState: function () {
            return {
                showNewTabForm: false,
                tabs: ['system']
            };
        },

        // Registering on a confirmed join with the list of tabs.
        componentDidMount: function () {
            this.props.socket.on('join', this.realAddTab);
        },

        // Selecting a new tab.
        selectTab: function (name) {
            return function () {
                this.props.setChannel(name);
            }.bind(this);
        },

        // Closing a tab with a given name.
        closeTab: function (name) {
            return function (e) {
                // Making sure that the selectTab function doens't run after
                // this one completes.
                e.stopPropagation();

                var idx = this.state.tabs.indexOf(name);
                if (idx !== -1) {
                    this.props.setChannel(this.state.tabs[idx - 1]);

                    var tmp = this.state.tabs;
                    tmp.splice(idx, 1);
                    this.setState({ tabs: tmp });

                    this.props.socket.emit('leave', name);
                }
            }.bind(this);
        },

        // Adding a new tab to the list of tabs.
        toggleAddTab: function () {
            if (this.state.expandingNewTabForm) {
                this.setState({
                    expandingNewTabForm: false,
                    hidingNewTabForm: true
                });

                // When you change the animation time in the CSS make sure
                // to change the duration of the timeout right here. Or else
                // there'll be a mismatch w/ the CSS animation and the
                // Javascript activity.
                setTimeout(function () {
                    this.setState({
                        hidingNewTabForm: false
                    })
                }.bind(this), 250);
            } else {
                this.setState({
                    expandingNewTabForm: true
                });
            }
        },

        // Validating a given tab name.
        validateTabName: function (name) {
            return name !== '';
        },

        // Adding a new tab to the list of tabs that exist.
        addTab: function (name) {
            if (!this.validateTabName(name))
                return false;

            this.props.socket.emit('join', {
                name: name
            });

            return true;
        },

        // Actually adding a new tab to the list - after the server has
        // confirmed that the user has joined.
        realAddTab: function (name) {
            if (this.state.tabs.indexOf(name) !== -1)
                return;

            var tmp = this.state.tabs;
            tmp.push(name);
            this.setState({
                tabs: tmp
            });

            this.props.newTab(name);
        },

        // Rendering a single TabElement of the TabList.
        makeElem: function (index) {
            return (
                <TabElement selected={this.state.tabs[index] === this.props.currentTab}
                            name={this.state.tabs[index]}
                            selectTab={this.selectTab}
                            closeTab={this.closeTab}
                            key={index} />
            );
        },

        // Rendering the tab list.
        render: function () {
            var elems = [];
            for (var i = 0; i < this.state.tabs.length; i++)
                elems.push(this.makeElem(i));

            var hideOverlay = function () {
                this.setState({
                    showNewTabForm: false
                });
            }.bind(this);

            return (
                <div className="tab-list">
                    {elems}

                    <PageOverlay show={this.state.showNewTabForm}
                                 hideOverlay={hideOverlay}>
                        <NewTabForm show={this.state.showNewTabForm}
                                    socket={this.props.socket}
                                    hideOverlay={hideOverlay} />
                    </PageOverlay>

                    <span onClick={function () { this.setState({ showNewTabForm: true }); }.bind(this)}
                          className="tab-add">
                        +
                    </span>
                </div>
            );
        }
    });

    global.TabList = TabList;
});
