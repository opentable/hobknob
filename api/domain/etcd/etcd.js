'use strict';

var config = require(__base + '/../config/api.json');
var Etcd = require('node-etcd');

module.exports.client = new Etcd(config.etcdHost, config.etcdPort);
