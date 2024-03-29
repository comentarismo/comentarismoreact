# Comentarismo REACT JS

What are the biggest killers of conversions on websites today?
Poor images, bad copy, lack of information, confusing navigation/layout, long forms, unclear error messages.

# Install
`npm install`

# (Required step for Production deployments) Install Bower dependencies & Prepare CSS/JS
## In a new terminal window, execute Gulp and leave it there, so it can re-run after any changes.
`npm run build`

# Run
`npm run dev-prod`


# Webstorm:
```
When resolving modules, WebStorm uses NODE_PATH environment variable defined in Default Node.js run configuration:
 on the main menu "Run | Edit Configurations..."
 expand "Defaults" node and select Node.js
 specify NODE_PATH in "Environment variables" field to ./app, so NODE_PATH=./app
 This will enable the right click feature within webstorm for quick navigation around files
 https://youtrack.jetbrains.com/issue/WEB-19476
```

## Run custom elk + rethinkdb + rethinkdb custom table + redis
ELASTICSEARCH_HOST=g7-box RETHINKDB_HOS=g7-box RETHINKDB_TABLE=test REDIS_HOST=g7-box npm run start

# System Requirements
## NodeJS 5.9.1
## NPM 3.10.9
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
`sudo n 5.9.1`

# RethinkDB is required to be configured if you are running in `development` mode
## Please make sure etc/hosts is something like this / pointing to the correct ip of your rethinkdb
`/etc/hosts
10.0.1.121        g7-box`

## Make sure RethinkDB has indexes for table news*
`languages`
`genre`
`countries`
`created`
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
`countries`


# Make sure RethinkDB has indexes for table commentaries:
`languages`
`nick`
`operator`
`titleurlize`
`genre`
`updatedAt`
# trash zone:
---`countries`,`created` ---

# Make sure Rethinkdb has indexes for table user:
`name`
`nickname`
`provider`

# Make sure Rethinkdb has indexes for table shorturl:
`longurl`

# Make sure Rethinkdb has indexes for table sentiment_report:
`type`


# RethinkDB queries reference
## [Link](rethinkdb.md)

# ENV Configuration 
`NODE_ENV`

`REDIS_HOST`
`REDIS_PORT`
`REDIS_PASSWORD`
`REDIS_EXPIRE`
`EXPIRE_REDIS`
`expiretime`

`RETHINKURL`
`RETHINKPORT`
`RETHINKAUTHKEY`
`RETHINKTABLE`

`$ EXPIRE_REDIS=true REDIS_EXPIRE=10 npm run start`

# For the admin panel to work for a user, make sure user has role admin:
`r.db('test').table("user").get("USER_ID_").update({"role":"admin"})`



# Deployment to production

* First make sure you installed all dependencies with `npm install` 
* Run `npm run build` (If you run `npm install` this step is not required as npm postinstall task)
* Make sure `etc/hosts` have `g7-box` and is properly configured
* Make sure Redis server is started 
* Default Start `NODE_ENV=production NODE_PATH=./app node app/server`
* Configure Redis and RethinkDB: `NODE_ENV=production REDIS_HOST=37.139.13.224 REDIS_PASSWORD=go3322321 RETHINKDB_HOST=g7-box NODE_PATH=./app nohup forever app/server &.`
* Optional password `RETHINKDB_KEY=12345 REDIS_PASSWORD=12345`

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


# Flynn cluster

flynn -a controller pg psql -- -c 'UPDATE apps SET deploy_timeout = 600'



```
http://dashboard.36zv.flynnhub.com 
token a7c7e02383e16cce32944d9f52d9f88a 
```

# Deploy app to Flynn
```
flynn limit set slugbuilder memory=2GB
git push flynn master

https://git.36zv.flynnhub.com/comentarismoreact.git
```

Backup cluster:
```
$ flynn -a comentarismo export --file flynncfg.tar.gz
$ flynn -a comentarismoreact export --file flynncfg.tar.gz
$ flynn -a imgresizer export --file flynncfg.tar.gz
```

Restore cluster flynn20may --> 9d89f9e731ef54111ca1846cfd849b245786bb2e4c3d4198d59ea00a815bc837
```
$ flynn import --file flynncfg.tar.gz 
```

Img 

to use in the commentators page
https://github.com/patientslikeme/react-calendar-heatmap

to use in the bv
https://github.com/fullstackreact/react-yelp-clone



wordcloud ?
https://react.rocks/example/lymbus

nice way to show the news ?
https://react.rocks/example/Conf_videos

cake chart with clicable and rendering after the click
https://github.com/alexkuz/cake-chart


insights for comentarismo ?
https://github.com/IBM-Bluemix/election-insights

analytics for comentarismo ?
https://github.com/janajri/analytics-influxdb
https://github.com/influxdata/telegraf


comentarismo dashboards ?
https://github.com/Raathigesh/Dazzle
https://github.com/thecitysecretltd/lumen-fx

steps
https://react.rocks/example/react-steps


charts
https://react.rocks/example/mutation-observer

Graphs of Twitter trends for the 2015 Oscars. Themes are top / red carpet / actors / films / noteworthy. Uses react-router, material-ui, dygraphs. Social sharing to Facebook / Twitter.
https://github.com/ecesena/oscars2015

Amazing project -- visualizing concepts such as Markov chains, conditional probability with interactive D3 visualizations.
https://github.com/vicapow/explained-visually

Visualization of student skills in Wellington NZ. Group, color by attribute. Bubble graphs, very fluid.
https://github.com/widged/SOT-skills-report


cheapass
https://github.com/aakashlpin/cheapass-ios-app


AUDIO:
https://www.npmjs.com/package/react-music-player
https://www.npmjs.com/package/react-cl-audio-player
https://github.com/souporserious/react-media-player
https://github.com/humanhighway/react-audio-player
https://react.rocks/example/react-audio-player

https://www.npmjs.com/package/player

https://github.com/maruf89/soundcloud-node

audio app
https://github.com/StreamMachine/StreamMachine
https://github.com/TooTallNate/node-lame
https://github.com/michael-gillett/node-stream-player

https://www.npmjs.com/package/websockets-streaming-audio

https://github.com/TooTallNate/node-speaker



$ rethinkdb proxy --join 91.121.75.229:29015

$ RETHINKDB_HOST=localhost forever updateImagesProductNewsWebDriver.js
$ RETHINKDB_HOST=localhost node updateSentimentNews.js



## Updating NodeJS
`$ npm install -g n`

Updating
`$ n 5.9.1`


Updating NPM
`$ curl -0 -L https://npmjs.org/install.sh | sudo sh`

Checking versions
```
$ node --version
v5.9.1
---
$ npm --version
3.10.9
```



https://devcenter.heroku.com/articles/node-best-practices#use-a-smart-npmrc
