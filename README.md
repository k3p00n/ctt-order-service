# Order service
![Infrastructure](docs/assets/Architecture-Infrastructure.svg)

## Description
This is a demo project for an order service. The service is implemented using the following technologies:
- Nest.js
- TypeORM
- PostgreSQL
- Docker
- Kafka

## External dependencies
The service depends on the contract service and preinstalled Kafka that provides the following topics:
- personevent-created
- personevent-updated
- personevent-deleted
- orderevent-created
- orderevent-updated
- orderevent-deleted

## How to run
To run the service, you need:
1. to have docker installed on your machine. Then you can run the following command:

```bash
docker-compose up
```

## Architecture
The service uses ADRs to document architectural decisions. The ADRs are stored in the `docs/adr` folder.

Architecture diagram is stored in the `docs/architecture.drawio` file.

## Proposed improvements
- Add unit tests
- Add integration tests
- Add caching
- Add logging
- Add health checks
- Check error handling
- Add resource based authorization
- Add rate limiting

