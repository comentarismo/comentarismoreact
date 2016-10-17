wget https://dl.influxdata.com/influxdb/releases/influxdb_1.0.2_amd64.deb
sudo dpkg -i influxdb_1.0.2_amd64.deb

sudo service influxdb start
sudo service influxdb status

> CREATE DATABASE comentarismoanalytics

Server -> 188.166.19.14



# Graphana:

## Ubuntu:
http://docs.grafana.org/installation/debian/
```
$ wget https://grafanarel.s3.amazonaws.com/builds/grafana_3.1.1-1470047149_amd64.deb
$ sudo apt-get install -y adduser libfontconfig
$ sudo dpkg -i grafana_3.1.1-1470047149_amd64.deb
```

