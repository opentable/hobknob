#!/bin/bash

# Start up the server in a way that won't block Travis.

npm start &
sleep 1
echo Hobknob started
