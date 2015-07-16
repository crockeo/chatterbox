# image-optimization

_**July 15, 2015 - 11:53 PM**_

So I'm sitting here doing some programming, making it so the MongoDB doesn't
save duplicate images. And I'm thinking, what can we do to make sure we don't
have to even deal with duplicate image requests? That'd be nice, right? So I say
to myself, how about we do this:

* Add an API checkpoint to check for the existence of an image with a given
  hash.

* Find some way to consistently hash a binary value on the client side and the
  server side.

* Before uploading a new image, check that endpoint from the client, if it
  exists then it ought to return the ID of that picture, and we're all done.

* If it doesn't exist, proceed to perform a normal image upload.
