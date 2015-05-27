#!/bin/bash

# Closing mongod upon ending this script.
trap ctrl_c INT
function ctrl_c() {
    sudo kill $(pgrep mongod)
}

# Starting mongod and gulp.
sudo mongod &
gulp
