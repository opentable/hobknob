// Use this script to migrate the audit from /v1/audit/toggle/* to /v1/audit/feature/*
// This script copies the audit trail only.

var etcdHost = process.argv[2] || 'localhost';
var etcdPort = parseInt(process.argv[3]) || 4001;
console.log("Migrating audit data. Etcd host: " + etcdHost + ", port: " + etcdPort);

var _ = require('underscore'),
  Etcd = require('node-etcd'),
  client = new Etcd(etcdHost, etcdPort);

client.get('/v1/audit/toggle', {recursive: true}, function (err, rootNode) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Migrating ' + rootNode.node.nodes.length + ' features...');

  _.each(rootNode.node.nodes, function (applicationNode) {
    _.each(applicationNode.nodes, function (featureNode) {
      _.each(featureNode.nodes, function (auditNode) {
        var newKeyName = auditNode.key.replace('/v1/audit/toggle/', '/v1/audit/feature/');
        console.log('Migrating: ' + auditNode.key + ' to: ' + newKeyName);
        client.set(newKeyName, auditNode.value, function (err) {
          throw err;
        });
      });
    });
  });
});
