# CRUD MEETUP-API

## Implementation:

- CRUD for users and meetups (create, get all, find by ID, delete all, delete by ID, update)
- Validation with [Passport](https://github.com/nestjs/passport)
- Filtering Meetups (by tags and title)
- Pagination for Meetups
- Sorting by Date (asc / desc) for Meetups
- Authetification and authorization (used access and refresh tokens. Saving into the cookies)
- Abiltity GUARD to check role (ADMIN / USER) and implement permitted request

## Database used:

- PostgreSQL 10
- Sequelize

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
