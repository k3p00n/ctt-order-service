# Selection Database
## Context
We need to select a database for our project.
## Decision
Use PostgreSQL for the database.

## Alternatives
- MySQL
- SQLite
- MongoDB
- MariaDB

## Conclusion
Initial tasks require to keep Person data up to date. In that case it more convenient to use relation database. Also it require to store items for the order without any needs to update them. In that cases more convenient to use relation database with support jsonb type. PostgreSQL is a good choice for that.