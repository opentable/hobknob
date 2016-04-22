# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"

  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  end

  # "Fix" for error 'stdin: is not a tty' (see https://github.com/mitchellh/vagrant/issues/1673)
  config.vm.provision :shell, inline: 'apt-get purge -y chef*'
  config.vm.provision :shell, inline: 'sed -i \'s/^mesg n$/tty -s \&\& mesg n/g\' /root/.profile'

  config.vm.network :forwarded_port, guest: 3006, host: 3006

  config.vm.provision "docker" do |d|
    d.pull_images "quay.io/coreos/etcd:v0.4.6"
    d.run "quay.io/coreos/etcd", args: "-p 4001:4001 --net=host", demonize: true
  end
  config.vm.provision "docker" do |d|
    d.build_image "/vagrant", args: '-t hobknob'
    d.run "hobknob", args: "-p 3006:3006 --net=host", demonize: true
  end
end
