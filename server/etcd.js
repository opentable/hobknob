var config = require('./../config/default.json'),
    Etcd = require('node-etcd');

module.exports.client = new Etcd(config.etcdHost, config.etcdPort);