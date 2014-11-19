var _ = require('underscore'),
    Etcd = require('node-etcd'),
    client = new Etcd('hobknob-etcd-qa.otenv.com', 4001);

client.get('/v1/audit/toggle', { recursive: true }, function(err, rootNode){
    if (err) {
        console.log(err);
        return;
    }

    console.log('Migrating ' + rootNode.node.nodes.length + ' features...');

    _.each(rootNode.node.nodes, function(applicationNode){
        _.each(applicationNode.nodes, function(featureNode){
            _.each(featureNode.nodes, function(auditNode){
                var newKeyName = auditNode.key.replace('/v1/audit/toggle/', '/v1/audit/feature/');
                console.log('Migrating: ' + auditNode.key + ' to: ' + newKeyName);
                client.set(newKeyName, auditNode.value, function(err){
                    throw err;
                });
            });
        });
    });
});
