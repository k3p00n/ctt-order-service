# How should application react to all person events
## Context
We need to decide how the application should react to all person events.
## Decision
The application should react to all person events by updating the person data in the database.
## Alternatives
- Ignore person create or delete events
## Conclusion
Contract service sometimes has latency issues in that case getting person data from contact service is not reliable. So it is better to update the person data in the database on every person event.
### Assumptions
- Most of the person created in contact service will be used in order service.
- Person could request to delete their account. In that case we should delete the person data from the database but keep the order data.