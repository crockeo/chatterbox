#!/bin/bash

# Closing mongod upon ending this script.
trap ctrl_c INT
function ctrl_c() {
    kill $(pgrep mongod)
}

# Starting mongod and gulp.
mongod > /dev/null &
gulp
