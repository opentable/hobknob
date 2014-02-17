String.prototype.rtrim=function(){
    return this.replace(/\/+$/,'');
};

// setup some paths that we'll need
var config = "grunt.option('config')";
var sshconfig = "grunt.config(['sshconfig', " + config + "])";
var current = "<%= " + sshconfig + ".path %>";
var symlink = "<%= " + sshconfig + ".path.rtrim() %>";
var release = "<%= " + sshconfig + ".releases + grunt.option('buildNumber') %>";
var releases = "<%= " + sshconfig + ".releases %>";
var configFile = current + "config/<%= " + config + " %>.yml";
var logs = current + "logs/";
var lbstatus = "<%= " + sshconfig + ".lbstatus %>";

var task = {
    installforever: {
        command: "npm install -g -y forever"
    },
    start: {
        command: "/etc/init.d/featuretoggle start"
    },
    stop: {
        command: "/etc/init.d/featuretoggle stop",
        options: {
            ignoreErrors: true
        }
    },
    'make-release-dir': {
        command: "mkdir -m 777 -p " + release + "/logs"
    },
    'update-symlinks': {
        command: "rm -rf " + symlink + " && ln -s " + release + " " + symlink
    },
    'npm-update': {
        command: "cd " + current + " && npm install --production"
    },
    'set-config': {
        command: "mv -f " + configFile + " " + current + "config/default.yml"
    },
    'take-app-offline':{
        command: "echo 'OFF' > " + lbstatus
    },
    'put-app-online':{
        command: "echo 'ON' > " + lbstatus   
    },

    'delete-old-release-dirs':{
        command: "cd " + releases + ";" +
            "IFS='#' read -a array <<< \"$(ls -lst -l | tail -$(($(ls . | wc -l)-10)) | awk '{ printf $10\"#\" }')\";" +
            "for x in \"${array[@]}\"; do echo \"Deleting directory " + releases + "$x\"; rm -r -f "+ releases +"$x; done"
    },
    'bower-update': {
        command: "cd " + current + " && bower install"
    }
}

module.exports = task;
