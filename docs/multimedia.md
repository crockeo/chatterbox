# multimedia

(As in implementing multimedia messaging)

### The What

Right now (at time of writing) Chatterbox can only handle text messages. That's
fine and well for the most part but a lot of communication now-a-days is through
images. As such I'm trying to extend the functionality of Chatterbox to work
with text messages or picture messages (with others coming at another point in
time?)

### The How

* **Expanding Message Schema** - First things first, the program expects
  messages to be of a certain form. There's a bunch of metadata, and then a
  'text' field that represents the message text. This needs to be expanded to
  have the metadata contain information on a replacement for 'text', which would
  be something like 'data'.

* **Rendering Multimedia** - On the client-side, with the new metadata, one can
  write a React class to handle the rendering of a set of different message
  types. Maybe make one to redirect rendering traffic, and a couple of of more
  specific ones to deal w/ the specific rendering.

* **UI Update** - After all of the back-end stuff is done, try to add new ways
  to submit different pieces of multimedia (probably just pictures).
