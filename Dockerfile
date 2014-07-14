FROM ubuntu:14.04
RUN apt-get update -q
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qy build-essential curl git
RUN curl -s http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-x64.tar.gz | tar -v -C /usr/local -xz
ENV PATH /usr/local/node-v0.10.25-linux-x64/bin:$PATH
ADD . /opt/hobknob
RUN npm install -g bower
RUN npm install
RUN bower install
run cp /opt/hobknob/config/client/vagrant/config.js /opt/hobknob/client/configuration/config.js
EXPOSE 3006
CMD ["node", "/opt/hobknob/server/app.js"]