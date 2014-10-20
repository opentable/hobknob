var config = require('./../config/config.json'),
    Etcd = require('node-etcd');

module.exports.client = new Etcd(config.etcdHost, config.etcdPort);