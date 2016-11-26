'use strict';

var config = require('config');
var Etcd = require('node-etcd');

module.exports.client = new Etcd(config.etcdHost, config.etcdPort);
