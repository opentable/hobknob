#!/bin/bash

# Start up the server in a way that won't block Travis.

bower cache clean --config.interactive=false && bower install --config.interactive=false

node server/app.js &
sleep 1
echo Hobknob started