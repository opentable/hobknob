#!/bin/bash

curl -s http://localhost:3006/ > /dev/null # poking the server to wake it up before starting tests.
grunt protractor
