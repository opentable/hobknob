# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.box = "Ubuntu precise 64 VMWare"
    config.vm.box_url = "http://files.vagrantup.com/precise64_vmware.box"
    config.vm.network :forwarded_port, guest: 80, host: 3006
    config.vm.network :forwarded_port, guest: 27017, host: 27017
    config.vm.network :forwarded_port, guest: 6379, host: 6379
    config.vm.provision :shell, :path => "setup/bootstrap.sh"
end 