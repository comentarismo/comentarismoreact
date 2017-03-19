


Connect to one of the clusters to check its health

```
$ ssh -l root -i ~/.flynn/installer/keys/flynn 146.185.143.51
```

check memory on each node:
```
free -m
              total        used        free      shared  buff/cache   available
Mem:           3951         3169       114            5         667        3373
Swap:             0           0           0
```

If memory is filled up, restart each node:
```
ssh -l root -i ~/.flynn/installer/keys/flynn 178.62.197.249
shutdown -r now

ssh -l root -i ~/.flynn/installer/keys/flynn 178.62.224.252
shutdown -r now

ssh -l root -i ~/.flynn/installer/keys/flynn 178.62.248.133
shutdown -r now
```

# wait for all to come back (around 5 mins)

Then restore:
```
flynn-host fix --min-hosts 3
INFO[03-19|14:19:51] found expected hosts                     n=3
INFO[03-19|14:19:51] ensuring discoverd is running on all hosts
INFO[03-19|14:19:52] checking flannel
INFO[03-19|14:19:53] flannel looks good
INFO[03-19|14:19:53] waiting for discoverd to be available
INFO[03-19|14:19:53] checking for running controller API
INFO[03-19|14:19:53] checking status of sirenia databases
INFO[03-19|14:19:53] checking for database state              db=postgres
INFO[03-19|14:19:53] checking sirenia cluster status          fn=CheckSirenia service=postgres
INFO[03-19|14:19:53] no running leader                        fn=CheckSirenia service=postgres
INFO[03-19|14:19:53] found running instances                  fn=CheckSirenia service=postgres count=0
INFO[03-19|14:19:53] getting sirenia status                   fn=CheckSirenia service=postgres
INFO[03-19|14:19:53] killing any running schedulers to prevent interference
INFO[03-19|14:19:53] getting service metadata                 fn=FixSirenia service=postgres
INFO[03-19|14:19:53] getting primary job info                 fn=FixSirenia service=postgres job.id=flynn14873533071-bec013c5-459c-4f0e-8fcb-a14d6dae3213
INFO[03-19|14:19:53] getting sync job info                    fn=FixSirenia service=postgres job.id=flynn14873533070-96f8a734-f96c-4c33-9de3-dcb7b0d49e6a
INFO[03-19|14:19:53] terminating unassigned sirenia instances fn=FixSirenia service=postgres
INFO[03-19|14:19:53] starting primary job                     fn=FixSirenia service=postgres job.id=flynn14873533071-5f39e5aa-60f5-4d92-9f1f-1f333868b28d
INFO[03-19|14:19:53] starting sync job                        fn=FixSirenia service=postgres job.id=flynn14873533070-980e3da5-0880-429a-88c1-b2fa5e57915f
INFO[03-19|14:19:53] waiting for instance to start            fn=FixSirenia service=postgres job.id=flynn14873533071-5f39e5aa-60f5-4d92-9f1f-1f333868b28d
INFO[03-19|14:19:54] waiting for cluster to come up read-write fn=FixSirenia service=postgres addr=100.100.21.2:5432
INFO[03-19|14:21:34] checking for database state              db=mariadb
INFO[03-19|14:21:34] skipping recovery of db, no state in discoverd db=mariadb
INFO[03-19|14:21:34] checking for database state              db=mongodb
INFO[03-19|14:21:34] skipping recovery of db, no state in discoverd db=mongodb
INFO[03-19|14:21:34] checking for running controller API
INFO[03-19|14:21:34] killing any running schedulers to prevent interference
INFO[03-19|14:21:35] no controller web process running, getting release details from hosts
INFO[03-19|14:21:35] provisioning volume for controller web job job.id=flynn14873533070-b78afb3b-9e19-487f-a212-56fdde13998c release=7a8b57d9-9fdd-41e7-9e63-be111a51c00c
INFO[03-19|14:21:36] starting controller web job              job.id=flynn14873533070-b78afb3b-9e19-487f-a212-56fdde13998c release=7a8b57d9-9fdd-41e7-9e63-be111a51c00c
INFO[03-19|14:21:36] waiting for job to start
INFO[03-19|14:21:36] found controller instance, checking critical formations
INFO[03-19|14:21:36] scheduler is not up, attempting to fix
INFO[03-19|14:21:36] started scheduler job
INFO[03-19|14:21:36] cluster fix complete
```

Ignore errors, restart the clusters in case of failure:

```
root@flynn-1487353307-2:~# flynn-host fix --min-hosts 3
14:12:55.536365 host.go:163: expected at least 3 hosts, but 2 found
```

Get other ips on digitalocean logs



Collect logs and send to flynn guys
sudo flynn-host collect-debug-info



create backup
flynn cluster backup

restore backuo

flynn cluster restore


token:
INFO[07-06|10:39:04] The built-in dashboard can be accessed at http://dashboard.9pdr.flynnhub.com with login token 49a34be38d27bff9f4ea5cd9295415e6


flynn import --file comentarismoreact-6july.tar
flynn import --file comentarismo-bkp-6july.tar
flynn import --file comentarismo-moody-bkp-6july.tar

350859b58ca4db6ea3bc2c6ba9525697cc332795cadc291b89f5f48392cf1199


https://dashboard.9pdr.flynnhub.com/
