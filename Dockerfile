FROM ubuntu:14.04

RUN apt-get update -q
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qy build-essential curl git

RUN sudo curl -s http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-x64.tar.gz | sudo tar -C /usr/local -xz
ENV PATH /usr/local/node-v0.10.25-linux-x64/bin:$PATH

ADD /docker /opt/hobknob
WORKDIR /opt/hobknob
RUN npm install bower -g
RUN npm install forever -g
RUN npm install
RUN bower install --allow-root

EXPOSE 3006
CMD ["forever", "start", "/opt/hobknob/server/app.js"]