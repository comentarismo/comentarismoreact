# Comentarismo REACT JS

# Install
`npm install`

# Install Bower dependencies
`bower install`

# Prepare CSS/JS
## In a new terminal window, execute Gulp and leave it there, so it can re-run after any changes.
`gulp`

# Run
`npm init`

# System Requirements
## NodeJS 5.6.0
## Gulp
## Mocha to run the tests
## Bower to download css/js dependencies like bootstrap

# CentOS/Fedora:
Avoid errors like: `make: g++: Command not found` by installing:
`yum install gcc-c++`

# Steps to Upgrade NodeJS

## Install NPM NodeJS installer
`sudo npm install -g n`

## Upgrade NodeJS
`sudo n 5.6.0`

# RethinkDB is required to be configured if you are running in `development` mode
## Please make sure etc/hosts is something like this / pointing to the correct ip of your rethinkdb
`/etc/hosts
10.0.1.121        g7-box`

## Make sure RethinkDB has indexes for table news*
`languages`
`genre`
`countries`
`created`
`languages`
`operator`
`titleurlize`
`date`

# Make sure RethinkDB has indexes for table commentator:
`languages`
`genre`
`nick`
`operator`
`totalComments`
`maxDate`


# Make sure RethinkDB has indexes for table commentaries:
`languages`
`nick`
`operator`
`titleurlize`
`genre`
# trash zone:
---`countries`,`created` ---

# Make sure Rethinkdb has indexes for table user:
`name`
`nickname`
`provider`

# Make sure Rethinkdb has indexes for table shorturl:
`longurl`


# RethinkDB queries reference
## [Link](rethinkdb.md)

# ENV Configuration 
`NODE_ENV`

`REDISURL`
`REDISPORT`
`REDISPASS`
`EXPIRE_REDIS`

`RETHINKURL`
`RETHINKPORT`
`RETHINKAUTHKEY`
`RETHINKTABLE`


# For the admin panel to work for a user, make sure user has role admin:
`r.db('test').table("user").get("USER_ID_").update({"role":"admin"})`



# Deployment to production

* First make sure you installed all dependencies with `npm install` 
* Run `npm run build` (If you run `npm install` this step is not required as npm postinstall task)
* Make sure `etc/hosts` have `g7-box` and is properly configured
* Make sure Redis server is started 
* Default Start `NODE_ENV=production NODE_PATH=./app node app/server`
* Configure Redis and RethinkDB: `NODE_ENV=production REDISURL=37.139.13.224 REDISPASS=go3322321 RETHINKURL=g7-box NODE_PATH=./app nohup forever app/server &.`
* Optional password `RETHINKAUTHKEY=12345 REDISPASS=12345`

# VI
```
shift + g
fn + up/down
```

# Redis PROD cmds:
```
sudo service redis_6379 start
sudo service redis_6379 stop
sudo vi /etc/redis/redis.conf
```

# Redis PROD quick install:
```
wget http://download.redis.io/releases/redis-stable.tar.gz
tar xzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
cd utils
sudo ./install_server.sh
Please select the redis executable path [] /root/redis-stable/src/redis-server3
sysctl vm.overcommit_memory=1 or vi /etc/sysctl.conf --> vm.overcommit_memory=1
```