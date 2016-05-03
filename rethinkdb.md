# Queries Reference:

# Create index:
`r.db('test').table("user").indexCreate("name")`

# Get all commentators from a newspaper and retrieve only its slug:
`r.db('test').table('commentator').getAll('bbcuk', {index:'operator'}).pluck("slug").distinct()`

# Get all news that have no date associated to it:

```
r.db('test').table('commentaries').filter(
          r.row.hasFields('date').not()
).count()
```

# Get the first time this commentator was seen:
```
r.db('test').table('commentaries').getAll("0racle",{index:'nick'}).min("date").pluck("date")
```

# Get the last time this commentator was seen:
```
r.db('test').table('commentaries').getAll("0racle",{index:'nick'}).max("date").pluck("date")
```