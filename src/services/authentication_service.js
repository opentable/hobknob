var ldap = require('ldapjs');

exports.login = function(username, password, callback) {
    var client = ldap.createClient({
        url: 'ldap://10.20.41.90:389'
    });
    
    client.bind(username, password, function (err) {
        console.log('binding....');
        if (err){
            console.log('error: ' + err);
            callback(false);
            return;
        }
        callback(true);
    });
};