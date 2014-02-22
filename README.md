featuretoggle-frontend
======================

![Dashboard Image](https://raw.github.com/opentable/featuretoggle-frontend/master/screenshots/dashboard.png?token=1033384__eyJzY29wZSI6IlJhd0Jsb2I6b3BlbnRhYmxlL2ZlYXR1cmV0b2dnbGUtZnJvbnRlbmQvbWFzdGVyL3NjcmVlbnNob3RzL2Rhc2hib2FyZC5wbmciLCJleHBpcmVzIjoxMzkzNzA5NTQ0fQ%3D%3D--c62040726360536c3a01a9b80caa42d7826d20a8 "Dashboard")


node/expressjs app to display feature toggles

Running the app locally
--

The application is dependant on NodeJS version 0.10.15. This should be installed prior to trying to run the application. After checkout you should install dependencies using npm

```
sudo npm update -y
sudo npm install -y
```

Front end packages are managed by bower 
```
npm install -g bower
bower install
```

To run a dev server that will automatically restart when file changes are detected:
```
node dev-app.js
```
You can then access the site on http://127.0.0.1:3006

Running on a vagrant instance
--

The vmware_fusion provider for Vagrant is required

`grunt vagrant-up` will spin up a vagrant instance with the application running on port 3006
