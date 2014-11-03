#!/bin/bash

# Start up the server in a way that won't block Travis.

node server/app.js &
sleep 1
echo Hobknob started