'use strict';

var config = require('./../config/config.json');
var Etcd = require('node-etcd');

module.exports.client = new Etcd(config.etcdHost, config.etcdPort);
