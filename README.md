<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

Back-end API of a social website like facebook using Typescript, NestJS, And PostgreSQL, without ORM
API have the following endpoints.

- Users can register in the system using their own personal information.
- Users can login into the system.
- Users can search other users by advanced search which will accept combinations of first name, last name and age.
- Users can add other users as friends, view requests list, accept or decline them.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **PostgreSQL**: Running instance of PostgreSQL
- **NestJS CLI**: If you want to scaffold the project easily.

## Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/ani7187/social-media-api.git
    cd social-media-api
    ```
    ```bash
    $ npm install
    ```
2. **Configure the .env file**: copy env.example and change

3. **Start the PostgreSQL server**:
Ensure your PostgreSQL database is running on the specified host and port, and that the database is created.

4. **DB schema**:
   Create tables. 
   The database schema is defined in the 001-create-tables.sql file.

5. **Access the app at**: http://localhost:3000.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deployment

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than
managing infrastructure.

## Contact
For more details or to report bugs, contact at:
- 📧Email: azizyana02@gmail.com