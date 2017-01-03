

const config = require('config');
const Etcd = require('node-etcd');

module.exports.client = new Etcd(config.etcdHost, config.etcdPort);
