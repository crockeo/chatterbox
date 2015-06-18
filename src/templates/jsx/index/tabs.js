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
            if (this.props.name === 'system') {
                return (
                    <span className={c} onClick={this.props.selectTab(this.props.name)}>
                        <span className="tab-element-name">{this.props.name}</span>
                    </span>
                );
            } else {
                return (
                    <span className={c} onClick={this.props.selectTab(this.props.name)}>
                        <span className="tab-element-name">{this.props.name}</span>
                        <span className="tab-element-close" onClick={this.props.closeTab(this.props.name)}>X</span>
                    </span>
                );
            }
        }
    });

    // The bar atop the chat messages that lists currently open tabs.
    var TabList = React.createClass({
        // Defining the schema of the TabList state along w/ default tabs.
        getInitialState: function () {
            return { tabs: ['system', 'main'] };
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
        addTab: function (name) {
            return function () {
                var tmp = this.state.tabs;
                tmp.push(name);
                this.setState({ tabs: tmp });

                this.props.socket.emit('join', name);
            }.bind(this);
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

            return (
                <div className="tab-list">
                    {elems}

                    <span className="tab-add" onClick={this.addTab('testing')}>+</span>
                </div>
            );
        }
    });

    global.TabList = TabList;
});
