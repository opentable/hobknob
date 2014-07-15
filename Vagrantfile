# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

    config.vm.box = "Ubuntu precise 64 virtualbox"
    config.vm.box_url = "http://files.vagrantup.com/precise64.box"
    config.vm.network :forwarded_port, guest: 3006, host: 3006
    config.vm.network :forwarded_port, guest: 4001, host: 4001

    config.vm.provision "docker" do |d|
        d.pull_images "coreos/etcd"
        d.run "coreos/etcd", cmd: "-cors http://127.0.0.1:3006", args: "-p 4001:4001", demonize: true
    end

    config.vm.provision "docker" do |d|
        d.build_image "/vagrant", args: '-t hobknob'
        d.run "hobknob", args: "-p 3006:3006", demonize: true
    end
end