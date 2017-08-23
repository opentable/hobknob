FROM node:6

ADD package.json /tmp/package.json
RUN cd /tmp && npm install -g grunt-cli && npm install

ADD . /var/www/hobknob
RUN cp -a /tmp/node_modules /var/www/hobknob/

WORKDIR /var/www/hobknob
RUN bower install --allow-root
EXPOSE 3006
CMD ["node", "server/app.js"]
