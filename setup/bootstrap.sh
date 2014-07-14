echo 'hello...'

apt-get update -y -q
apt-get install git-core curl build-essential openssl libssl-dev nginx -y -q

# install node
wget --quiet http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-x64.tar.gz
tar -zxf node-v0.10.25-linux-x64.tar.gz

mv node-v0.10.25-linux-x64/ /opt/node/
ln -s /opt/node/bin/node /usr/bin/node
ln -s /opt/node/bin/npm /usr/bin/npm

npm install forever -g
npm install bower -g

node /var/www/hobknob/server/app.js
