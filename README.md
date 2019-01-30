[![CircleCI](https://circleci.com/gh/CharlesMulic/sr-api.svg?style=svg)](https://circleci.com/gh/CharlesMulic/sr-api)

Use the NFL schedule feed as your source: https://api.ngs.nfl.com/league/schedule?season=2018&seasonType=REG

Ingest data from the feed into a database of your choice (allow for ingestion of different seasons and season types)

Create TWO endpoints:

- An endpoint that accepts parameters for year/season and/or team alias then returns corresponding teams and bye weeks. A bye week for the NFL is a week that team does NOT play.
- An endpoint should take a team alias as a parameter and return the average number of points AFTER the bye week (optionally by period, so include a period parameter as well).

Treat this project as if you were submitting a pull-request for approval to go to production (e.g. project organizations, code quality, etc)

You can send back a zip file, or post a github repo with code, up to you.

Make sure we can run the project once received.

Let me know if you have any questions.

expressjs as web server framework
mocha/should/sinon/proxyquire for testing (although thinking of moving to jest)
objectionjs as our orm for most services
prefer native Promises for flow control in javascript
