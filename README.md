<img src="http://media.otstatic.com/img/logo-7cd459fb1da36ae8f2030a77aa098c2a.png" style="width:150px;margin:0 16px -4px 0;" alt="opentable logo" title="OpenTable" />Hobknob
======================

[![Build Status](https://travis-ci.org/opentable/hobknob.svg?branch=master)](https://travis-ci.org/opentable/hobknob)
[<img src="http://standards-badges.herokuapp.com/image?serviceStatusEndpoint=0&logSchema=0&githubReadme=1">](http://standards-badges.herokuapp.com/?serviceStatusEndpoint=0&logSchema=0&githubReadme=1)
[![Join the chat at https://gitter.im/opentable/hobknob](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/opentable/hobknob?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Hobknob is a feature toggle front-end built on top of [etcd](https://github.com/coreos/etcd).
It allows users to create and modify feature toggles, which can then be accesesed in your applications.

<div style="text-align:center">
  <img src="screenshots/FeatureView.png" width="70%">
</div>

## Full Documentation
See the [Wiki](https://github.com/opentable/hobknob/wiki/) for full documentation, examples, operational details and other information.

## Running the application

### Vagrant
The quickest way to run the app locally is to use Vagrant. If you don't have Vagrant you should install it from [here](http://www.vagrantup.com/).
`vagrant up` will spin up a vagrant instance and install etcd and Hobknob, which are exposed on ports 4001 and 3006 respectfully.
Hobknob itself is deployed in a Docker container inside of the vagrant instance.

#### Notes
There seems to be an existing issue with Vagrant version 1.7.2 when attempting to install Docker. Currently, Vagrant version 1.7.4 will work.

### Manual
The application is dependant on NodeJS version 0.10.26. This can be downloaded [here](http://nodejs.org/download/).

#### etcd
A local (or development) installation of Hobknob is configured to use a locally running etcd instance. A useful guide is available [here](https://github.com/coreos/etcd#getting-started).
Or, here is a simple way to etcd up and running on a Mac:

```sh
$ curl -L https://github.com/coreos/etcd/releases/download/v0.4.6/etcd-v0.4.6-darwin-amd64.zip | tar xvz
$ cd etcd-v0.4.6-darwin-amd64
$ ./etcd
```

#### Hobknob

The following will checkout and run Hobknob (accessible http://127.0.0.1:3006/).

```sh
$ git clone git@github.com:opentable/hobknob.git
$ cd hobknob
$ npm install
$ grunt
$ npm start
```


it's kind of important for contributors (not users) \\|/
## Testing with Protractor
We've integrated [protractor](https://github.com/angular/protractor) for end-to-end testing. To start these tests run:

```sh
# Make sure you have the app running first
$ npm test
```

## Preparing the config
Client-side configuration specifies following settings:
* if authentication is required (be default it's not),
* etcd host and port,
* host and port of hobknob,
* categories which simply means what kind of feature toggles can be created,
* plugin

To generate the client-side config, you need to run the following command (until we find a better solution):
```sh
$ grunt
```
It'll apply configuration stored in `config/config.json`.

You can then access the site on http://127.0.0.1:3006

## Configuring Feature Categories
You can define the feature categories in the configuration file (config/config.json). Note, category id 0 is reserved for the simple, single value feature toggle category (however, you can still specify it in the config to set the name and description).

Example:

```javascript
{
    ...

    "categories": [
        {
            "id": 0, // id = 0 is reserved for the simple feature category only. Name and description are optional
            "name": "Simple Features",
            "description": "Use when you want your feature to be either on or off"
        },
        {
            "id": 1,
            "name": "Domain Features",
            "description": "Use when you want your features to be toggled separately for different domains (e.g. com, couk, fr, ...)",
            "values": ["com", "couk", "de", "fr"] // must define values when id != 0
        }
    ]
}
```

## Hobknob Clients
There are several clients for different languages.

- https://github.com/opentable/hobknob-client-nodejs
- https://github.com/opentable/hobknob-client-net
- https://github.com/opentable/hobknob-client-java
- https://github.com/opentable/hobknob-client-go

## Bugs and Feedback
For bugs, questions and discussions please use the [Github Issues](https://github.com/opentable/hobknob/issues).

## Release Notes

### 2.0.x Breaking audit trail changes

Feature audits are now stored in the following etcd directory: `http://etcd_host:etcd_port/v2/keys/v1/audit/feature/`.

Use the included script to migrate the audit trail made in versions of Hobknob prior to release 2.0.

```sh
node scripts/migrate_etcd_audit_2.0.js <etcd_host> <etcd_port>
```
