
# List all commentators by operator
http://localhost:3002/api/commentators/operator/uol/0/50/


# Commentator profile
http://localhost:3002/api/commentators/uol-0-1070-9/


# News by index and filter with skip limit optional order
http://localhost:3002/fapi/news/operator/bbcuk/genre/politics/0/50/?order=date

# iInifite scroll on news section by genre

http://localhost:3002/gapi/news/genre/business/100/50?sort=date

# Infinite scroll on news section by operator
/gapi/news/operator/lemonde/100/50?sort=date