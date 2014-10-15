var etcd = require('../etcd'),
    _ = require('underscore');

module.exports = {
    getApplications: function(req, res){
        etcd.client.get('v1/toggles/', {recursive: true}, function(err, result){
            if (err) throw err;

            var applications = _.map(result.node.nodes, function(node)
                {
                    var splitKey = node.key.split('/');
                    return splitKey[splitKey.length - 1];
                });
            res.send(applications)
        });
    },

    addApplication: function(req, res){
        var applicationName = req.body.name;
        etcd.client.mkdir('v1/toggles/' + applicationName, function(err){
            if (err) throw err;

            res.send(201)
        })
    }
}