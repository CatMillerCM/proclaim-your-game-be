# Proclaim Your Game

Welcome to 'Proclaim Your Game' - an interactive database of boardgames that makes use of multiple endpoints and queries. 

Search up our classic categories, read reviews about a family favourite, leave comments about that new board-on-the-block, and so much more!

You can find a link to the hosted version here: https://dashboard.heroku.com/apps/proclaim-your-game

## Using this database
### Cloning
To run this project, the repository will have to be cloned down to your local environment.

Firstly, open your terminal and cd into your preferred directory.

Next, enter the following command to clone the Proclaim Your Game repo:

```bash
git clone https://github.com/catcodingcat/backend-project-nc-games.git
```


### Installing dependencies
The package.json file should be automatically cloned down with the repo. This includes all of the scripts and dependencies to successfully run the files.

To ensure you have installed all the relevant software, enter the following command in your terminal:

```bash
npm i
```


### Creating .env files
To connect the server files and tests to the relevant database, two .env files must be created. In your terminal, enter:

```bash
touch .env.development
```
Followed by:

```bash
echo "PGDATABASE=DATABASE_NAME_HERE" > .env.development
```

Here DATABASE_NAME_HERE refers to the databases outlined in the setup file that we will be accessing.

This populates the file with the associated database name.

Then create the test files in the same way:

```bash
touch .env.test
```

Followed by:

```bash
echo "PGDATABASE=DATABASE_NAME_HERE_test" > .env.test
```


### Seeding
To seed the local database, run the command:

```bash
npm run setup-dbs
```

Followed by:

```bash
npm run seed
```


### Running tests
To view and run all the associated tests with the project, run the command:

```bash
npm t app
```



## Software required
To run this project, you will need both Node.js and Postgres installed.

The minimum versions required are:

- Node.js 16+
- Postgress 8+



## I hope you enjoy Proclaim Your Game!
