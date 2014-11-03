SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`


node node_modules/protractor/bin/protractor client/tests/e2e/protractor.conf.js
