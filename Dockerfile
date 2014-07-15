FROM node:0.10

RUN apt-get update -q
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qy build-essential curl

ADD . /opt/hobknob
WORKDIR /opt/hobknob
RUN npm install bower -g
RUN npm install forever -g
RUN npm install
RUN bower install --allow-root

EXPOSE 3006
CMD ["forever", "-o out.log",  "-e err.log", "/opt/hobknob/server/app.js"]