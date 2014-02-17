var task = {
    fiveseconds: {
        options: {
            delay: 5000,
            before : function() {
                console.log('pausing 5 seconds');
            },
            after : function() {
                console.log('pause end');
            }
        }
    },
    tenseconds: {
        options: {
            delay: 10000,
            before : function() {
                console.log('pausing 10 seconds');
            },
            after : function() {
                console.log('pause end');
            }
        }
    }
};

module.exports = task;

