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

# RethinkDB is required
## Please make sure etc/hosts is something like this:
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
`countries`
`nick`
`operator`
`totalComments`

# Make sure RethinkDB has indexes for table commentaries:
`countries`
`languages`
`nick`
`operator`
`titleurlize`

# Make sure Rethinkdb has indexes for table user:
`name`

# RethinkDB queries reference
## [Link](rethinkdb.md)


# Deployment to production

* First make sure you installed all dependencies with `npm install` 
* Run `npm run build` (If you run `npm install` this step is not required as npm postinstall task)
* Make sure `etc/hosts` have `g7-box` and is properly configured
* Make sure Redis server is started 
* Default Start `NODE_ENV=production NODE_PATH=./app node app/server`
* Configure Redis and RethinkDB: `NODE_ENV=production REDISURL=g7-box REDISPORT=6379 RETHINKURL=g7-box RETHINKPORT=28015 NODE_PATH=./app node app/server`