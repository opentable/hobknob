#!/bin/bash

curl -s http://localhost:3006/ > /dev/null # poking the server to wake it up before starting tests.
node node_modules/protractor/bin/protractor client/tests/e2e/protractor.conf.js
