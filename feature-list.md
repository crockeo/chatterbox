# The Feature List

Otherwise known as the TODO list - the place where I list out all of the things
that I want done, but aren't yet.

## TODOs

* Multimedia message formats.
* Caching messages.
* Channel management.               - **DONE**
* Password-channel authentication.  - **DONE**
* Saving implicit user preferences. - **DONE**

**AFTER EVERYTHING ELSE IS DONE**

* Read some information on the internet about UI design and do a final redesign
  of the site.

## TODOs: Expanded

* Multimedia message formats &mdash; Right now you can only send text messages
  but I want to make it so you can send images - and also be able to send image
  links and have them be expanded as images. I'm not really sure that sound or
  video is necessary seeing as one can literally just use YouTube for that.

* Caching messages &mdash; Messages aren't stored in the server, and as such one
  loses all chat history when they leave a chat room / go to a different page.
  Instead messages should be stored and automatically loaded for the appropriate
  channels on page load.

* Channel management &mdash; Channels are automatically public and there's no
  way to change that as a consumer of the API. Instead there should be a page or
  an overlay to manage the required authentication for a channel along w/
  invited users.

* Password-channel authentication &mdash; Even if a channel were set to require
  a password, right now it wouldn't actually let you join because there's no way
  on the client to submit a password.

* Saving implicit user preferences &mdash; Basic stuff like which channels a
  user was in the last time they used the application isn't saved. When a user
  disconnects, before you remove their socket validation, save their channels to
  the MongoDB and serve them back up upon reconnect.
