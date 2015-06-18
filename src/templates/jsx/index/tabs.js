// Name  : tabs.js
// Author: Cerek Hillen
//
// Description:
//   The portion of the app that manages the tabs. Client-side, it's the bar on
//   top of the chat screen.

//////////
// Code //

withGlobal(function (global) {
    // The bar atop the chat messages that lists currently open tabs.
    var TabList = React.createClass({
        // Rendering a specific tab element.
        TabElement: React.createClass({
            // Rendering the current TabElement.
            render: function () {
                var c = this.props.selected ? 'tab-element selected' : 'tab-element';
                return (
                    <span className={c} onClick={this.props.selectTab(this.props.name)}>
                        <span className="tab-element-name">{this.props.name}</span>
                        <span className="tab-element-close" onClick={this.props.closeTab(this.props.name)}>X</span>
                    </span>
                )
            }
        }),

        // Rendering a single TabElement of the TabList.
        makeElem: function (index) {
            return (
                <this.TabElement selected={this.props.tabs[index] === this.props.currentTab}
                                 selectTab={this.props.selectTab}
                                 closeTab={this.props.closeTab}
                                 name={this.props.tabs[index]}
                                 key={index} />
            );
        },

        addNewTab: function () {

        },

        render: function () {
            var elems = [];
            for (var i = 0; i < this.props.tabs.length; i++)
                elems.push(this.makeElem(i));

            return (
                <div className="tab-list">
                    {elems}

                    <span className="tab-add" onClick={this.addNewTab}>+</span>
                </div>
            );
        }
    });

    global.TabList = TabList;
});
