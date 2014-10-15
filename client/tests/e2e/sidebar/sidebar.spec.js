var Etcd = require('node-etcd'),
    etcd = new Etcd();

describe("SideBar", function () {

    beforeEach(function(done) {
        etcd.mkdir('v1/toggles/testApp1', function(){
            etcd.mkdir('v1/toggles/testApp2', function(){
                browser.get('/', done);
            });
        });
    });

    afterEach(function(done){
        etcd.del('v1/toggles/testApp1', { recursive: true });
        etcd.del('v1/toggles/testApp2', { recursive: true }, done);
    });

    it("should display all applications", function() {
        var applicationLinks = element.all(by.css('#sidebar-menu li a'));
        expect(applicationLinks.count()).toEqual(2);

        expect(applicationLinks.first().getText()).toEqual('testApp1');
        expect(applicationLinks.last().getText()).toEqual('testApp2');
    });

    // todo: add application tests
});
