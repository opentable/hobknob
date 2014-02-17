var task = {
    deploy: {
        files: {
            "./": "temp/package/**"
        },
        options: {
            srcBasePath: "temp/package/",
            createDirectories: true
        }
    }
};

module.exports = task;
