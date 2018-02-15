
```
  r.db('test').table('commentaries')
   .getAll("english", {index: "languages"})
        .filter(r.row("date").lt(r.now()))
        .limit(50000)
        .orderBy(r.desc("date"))
        .skip(0).limit(50)
```


Get all comments orderBy date filter english ones and get 100 random samples
```
r.table('commentaries').orderBy({"index": r.desc("date")})
        .filter(r.row("languages").eq("english"))
        .skip(0).limit(5000).sample(100)
```