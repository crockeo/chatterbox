// Name  : chat.js
// Author: Cerek Hillen
//
// Description:
//   The portion of the chat application that interacts directly with sending
//   and receiving messages.

//////////
// Code //

withGlobal(function (global) {
    // Displaying other people's (and your own) messages.
    var Messages = React.createClass({
        // Trying to scroll down upon receiving a new message.
        componentDidUpdate: function (prevProps) {
            if (prevProps.messages !== this.props.messages) {
                var div = this.refs.chatMessages.getDOMNode();
                div.scrollTop = div.scrollHeight;
            }
        },

        // Rendering the set of messages.
        render: function () {
            var messages = [];
            for (var i = 0; i < this.props.messages.length; i++)
                messages.push(<Message message={this.props.messages[i]}
                                       key={i} />);

            return (
                <div ref="chatMessages" className="chat-messages" onScroll={this.onScroll}>
                    {messages}
                </div>
            );
        }
    });

    var ChatBox = React.createClass({
        // Functionality to perform when the user attempts to submit a new message.
        onSubmit: function (e) {
            if (this.props.connected) {
                e.preventDefault();

                var chatInput = this.refs.chatInput.getDOMNode(),
                    text      = chatInput.value.trim();

                // Preventing the user from sending any messages that don't have
                // any text.
                if (text == '')
                    return;

                var auth = Cookies.get('auth');

                try       { auth = JSON.parse(auth); }
                catch (e) { auth = {};               }

                this.props.socket.emit('message', {
                    channel : this.props.channel,
                    username: auth.username,
                    auth    : auth.auth,
                    time    : new Date(),
                    type    : 'text',
                    data    : { text: text }
                });

                chatInput.value = '';
            }
        },

        // Attempting to upload the picture any time the upload-picture file
        // dialog changes.
        uploadPicture: function (e) {
            var imgInput = this.refs.imgInput.getDOMNode();
            if (imgInput.files.length !== 1) {
                console.log('Invalid number of files: ' + imgInput.files.length);
                return;
            }

            var img    = imgInput.files[0],
                reader = new FileReader();

            reader.onload = function (e) {
                makeRequest({
                    method: 'POST',
                    path: '/api/image',

                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },

                    body: JSON.stringify({
                        contentType: imgInput.files[0].type,
                        data       : e.target.result
                    }),

                    onload: function (response) {
                        var json;
                        try {
                            json = JSON.parse(response);
                        } catch (e) {
                            return console.log('Failed to parse JSON response.');
                        }

                        // It all worked - we have a new image, time to send an
                        // image message.
                        if (json.success) {
                            var auth = Cookies.get('auth');

                            try       { auth = JSON.parse(auth); }
                            catch (e) { auth = {};               }

                            this.props.socket.emit('message', {
                                channel : this.props.channel,
                                username: auth.username,
                                auth    : auth.auth,
                                time    : new Date(),
                                type    : 'img',
                                data    : { imgId: json.id }
                            });
                        }
                    }.bind(this)
                });
            }.bind(this);

            reader.readAsBinaryString(img);
        },

        // Simulating a click into the imgInput dialog.
        simulateClick: function () {
            var imgInput = this.refs.imgInput.getDOMNode();

            imgInput.value = null;
            imgInput.click();
        },

        // Rendering out the ChatBox.
        render: function () {
            return (
                <div className="chat-form-container">
                    <form onSubmit={this.onSubmit} className="chat-form">
                        <input placeholder={this.props.connected ? 'Enter chat messages.' : 'Waiting for server connection...'}
                               disabled={!this.props.connected}
                               className="chat-input"
                               ref="chatInput" />

                        <button type="submit" className="chat-button left">
                            <span className="glyphicon glyphicon-arrow-right"></span>
                        </button>
                    </form>

                    <button onClick={this.simulateClick} className="chat-button">
                        <span className="glyphicon glyphicon-picture"></span>
                    </button>

                    <input onChange={this.uploadPicture}
                           className="image-input"
                           ref="imgInput"
                           type="file" />
                </div>
            );
        }
    });

    // The Chat portion of the application.
    var Chat = React.createClass({
        // Rendering out the whole chat portion of the application - both the
        // Messages and the ChatBox.
        render: function () {
            return (
                <div className="max-height">
                    <Messages messages={this.props.messages} />
                    <ChatBox connected={this.props.connected}
                             channel={this.props.channel}
                             socket={this.props.socket} />
                </div>
            );
        }
    });

    global.Chat = Chat;
});
