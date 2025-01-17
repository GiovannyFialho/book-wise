# BookWise 📚

## Installation
To get started with the project, follow these steps.

### Install Dependencies
Run the following command to install the required dependencies:
```
npm install
```

### ENV
You will need to create a `.env` file based on the `env-example` file.

### Database
> The project uses SQLite as the database and Prisma as the ORM. To create the database, run:
```
npm run prisma:populate
```

> Whenever you need to create a new table, you need to run a migration:
```
npm run prisma:migrate
```

> Whenever you need to modify an existing table, you will need to update the migration:
```
npm run prisma:migrate:createOnly
```

### Images
> The images are inside `assets.zip`. You need to unzip it and place all the content inside:
```
book-wise/public
```

### Environments

#### Web Application
To start the development server for the web application, run:
```
npm run dev
```

#### Database Web Interface
To open the Prisma Studio (web interface for the database), run:
```
npm run prisma:studio
```
