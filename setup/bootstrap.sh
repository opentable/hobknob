echo 'hello...'

apt-get update -y -q
apt-get install git-core curl build-essential openssl libssl-dev nginx -y -q

# nginx setup
cp /vagrant/setup/nginx_site_config /etc/nginx/sites-available/default
/etc/init.d/nginx restart

# install node
wget --quiet http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-x64.tar.gz
tar -zxf node-v0.10.25-linux-x64.tar.gz

mv node-v0.10.25-linux-x64/ /opt/node/
ln -s /opt/node/bin/node /usr/bin/node
ln -s /opt/node/bin/npm /usr/bin/npm

# create deployment user
useradd otdeploy --create-home -s /bin/bash
echo "otdeploy:vagrant"|chpasswd

# setup directories for deployed files
mkdir -p /var/www/featuretoggle
chown otdeploy /var/www/featuretoggle
chgrp otdeploy /var/www/featuretoggle


npm install forever -g

# install init script
cp /vagrant/setup/featuretoggle /etc/init.d/featuretoggle
chmod +x /etc/init.d/featuretoggle
update-rc.d featuretoggle defaults