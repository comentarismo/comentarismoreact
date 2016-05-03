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

# RethinkDB queries reference
## [Link](rethinkdb.md)