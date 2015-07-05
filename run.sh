#!/usr/bin/env bash

if [ "$1" = "cleandb" ]; then
    mongod > /dev/null &
    node src/app.js cleandb
    kill $(pgrep mongod)
else
    # Closing mongod upon ending this script.
    trap ctrl_c INT
    function ctrl_c() {
        kill $(pgrep mongod)
    }

    # Starting mongod and gulp.
    mongod > /dev/null &
    gulp
fi
