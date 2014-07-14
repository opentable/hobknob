# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

    config.vm.box = "Ubuntu precise 64 virtualbox"
    config.vm.box_url = "http://files.vagrantup.com/precise64.box"
    config.vm.network :forwarded_port, guest: 3006, host: 3006
    config.vm.synced_folder ".", "/docker",
      owner: "root", group: "root"

    config.vm.provision "docker" do |d|
        d.pull_images "coreos/etcd"
        d.run "coreos/etcd", cmd: "/opt/etcd/bin/etcd -cors *", demonize: true
    end

    config.vm.provision "docker" do |d|
        d.build_image "/vagrant", args: '-t hobknob'
        d.run "hobknob", args: "-p 3006:3006 --link coreos-etcd:coreos-etcd", demonize: true
    end
end