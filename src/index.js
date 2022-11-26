import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'postgres',
    password: POSTGRES_PASSWORD || 'postgres',
    port: POSTGRES_PORT || 5432,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();


  await client.query(`CREATE TABLE
    users (
      id serial PRIMARY KEY NOT NULL, 
      name VARCHAR(30) NOT NULL,
      date DATE DEFAULT(CURRENT_DATE)
    );
  `);

  await client.query(`CREATE TABLE 
    categories (
      id serial PRIMARY KEY NOT NULL,
      name VARCHAR(30) NOT NULL
    );
  `);

  await client.query(`CREATE TABLE
    authors (
      id serial PRIMARY KEY NOT NULL,
      name VARCHAR(30) NOT NULL
    );
  `);

  await client.query(`CREATE TABLE
    books (
      id serial PRIMARY KEY NOT NULL,
      title VARCHAR(30) NOT NULL,
      userid INTEGER NOT NULL, FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE,
      authorid INTEGER NOT NULL, FOREIGN KEY(authorid) REFERENCES authors(id) ON DELETE CASCADE,
      categoryid INTEGER NOT NULL, FOREIGN KEY(categoryid) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  await client.query(`CREATE TABLE
    descriptions (
      id serial PRIMARY KEY NOT NULL,
      description VARCHAR(10000) NOT NULL,
      bookid INTEGER UNIQUE NOT NULL,
      FOREIGN KEY(bookid) REFERENCES books (id)
      ON DELETE CASCADE
    );
  `);

  await client.query(`CREATE TABLE
    reviews (
      id serial PRIMARY KEY NOT NULL,
      message VARCHAR(10000) NOT NULL,
      userid INTEGER NOT NULL, FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE,
      bookid INTEGER NOT NULL, FOREIGN KEY(bookid) REFERENCES books(id) ON DELETE CASCADE
    );
  `);
  
  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`INSERT INTO users (name) 
  VALUES ('Eugene');`);

  await client.query(`INSERT INTO authors (name) 
  VALUES ('Mark Twain');`);

  await client.query(`INSERT INTO categories (name)
  VALUES ('Adventure');`);

  await client.query(`INSERT INTO books (title, userid, authorid, categoryid) 
  VALUES ('The adventures of Tom Sawyer', 1, 1, 1);`);

  await client.query(`INSERT INTO descriptions (description ,bookid) 
  VALUES ('Mark Twain's 1876 novel about a boy growing up with his aunt by the Mississippi River', 1);`);

  await client.query(`INSERT INTO reviews (message, userid, bookid) 
  VALUES ('cool story', 1, 1);`);
  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
