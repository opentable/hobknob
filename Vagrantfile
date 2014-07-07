# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.box = "Ubuntu precise 64 virtualbox"
    config.vm.box_url = "http://files.vagrantup.com/precise64_virtualbox.box"
    config.vm.network :forwarded_port, guest: 80, host: 3006
    config.vm.provision :shell, :path => "setup/bootstrap.sh"
    config.vm.provision "docker" do |d|
        d.pull_images "coreos/etcd"
        d.run "coreos/etcd", args: "-p 4001:4001 -p 7001:7001", demonize: true
    end

end 