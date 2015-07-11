// Name  : overlay.js
// Author: Cerek Hillen
//
// Description:
//   A generic React class to do a page-wide overlay.

//////////
// Code //

withGlobal(function (global) {
    // A global page overlay. It requires certain properties:
    //  * 'hideOverlay' - A function to hide the overlay.
    //
    //  * 'children'    - The elements contained in this element. Automatically
    //                    defined when other elements are added as children in
    //                    natural HTML syntax.
    //
    //  * 'show'        - Whether or not the overlay should be shown.
    var PageOverlay = React.createClass({
        getInitialState: function () {
            return {
                hidden: true
            };
        },

        // Constraining property types.
        propTypes: {
            'hideOverlay': React.PropTypes.func.isRequired,
            'show'       : React.PropTypes.bool.isRequired
        },

        // Calculating the fade class of an overlay container.
        calcContainerClass: function () {
            var c = 'page-overlay-container ';

            if (this.state.hidden)
                return c + 'hidden';
            else if (this.props.show)
                return c + 'fade-in';
            else
                return c + 'fade-out';
        },

        // Updating the internal hidden flag depending on the state of the show
        // property.
        componentWillReceiveProps: function (nextProps) {
            if (nextProps.show)
                this.setState({ hidden: false });
            else {
                setTimeout(function () {
                    this.setState({ hidden: true });
                }.bind(this), 80);
            }
        },

        // Rendering out the PageOverlay.
        render: function () {
            return (
                <div className={this.calcContainerClass()}>
                    <div className="page-overlay-background" onClick={this.props.hideOverlay}></div>

                    <div className="page-overlay-content">
                        {this.props.children}
                    </div>
                </div>
            );
        }
    });

    // Exporting some values to the global scope.
    global.PageOverlay = PageOverlay;
});
