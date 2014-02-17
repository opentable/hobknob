var task = {
    build: {
        files: [
            {expand: true, src: ['src/**'], dest: 'package/'},
            {expand: true, src: ['config/**'], dest: 'package/'},
            {expand: true, src: ['public/**'], dest: 'package/'},
            {expand: true, src: ['routes/**'], dest: 'package/'},
            {expand: true, src: ['views/**'], dest: 'package/'},
            {src: ['app.js'], dest: 'package/', filter: 'isFile'},
            {src: ['package.json'], dest: 'package/', filter: 'isFile'},
            {src: ['bower.json'], dest: 'package/', filter: 'isFile'},
            {src: ['.bowerrc'], dest: 'package/', filter: 'isFile'}
        ]
    },
    buildOutputAsPackage: { // used when deploying locally to vagrant
        files: [
            {
                expand: true,
                cwd: "package/",
                src: ["**"],
                dest: "temp/package"
            }
        ]
    }
};

module.exports = task;
