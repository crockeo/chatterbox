# chatterbox

*chatterbox* is a web-based chat program written in Javascript using React,
MongoDB, Node, Express, Jade, and SCSS. Its main goal is to explore the realm of
front-end design using technologies for the web. The idea is that in its
completed state I would want me - or any given person - to be able to look at it
and have a hard time finding some piece of its UI that's buggy or hard to use.

### USAGE

To set up this project, do the following:

```bash
$ git clone http://github.com/crockeo/chatterbox.git
$ cd chatterbox
$ bower install
$ npm install
```

After that, you have two options. Either you can run the project as one would
while developing (automatically updating and reloading templates & source code),
or deploy the dependencies and run it statically.

Development version:

```bash
$ gulp
```

If you don't have a MongoDB process running on your server already, you may want
to instead use `run.sh` which forks a `mongod` process along with starting gulp.

Production:

```bash
$ gulp deploy
$ node src/app.js
```

### LICENSE

Refer to the LICENSE file for licensing information.
