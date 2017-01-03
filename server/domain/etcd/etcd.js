const config = require('./../../../config/config.json');
const Etcd = require('node-etcd');

module.exports.client = new Etcd(config.etcdHost, config.etcdPort);
