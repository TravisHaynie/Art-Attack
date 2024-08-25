DROP DATABASE IF EXISTS art_attack_db;
CREATE DATABASE art_attack_db;

\c art_attack_db; -- Connect to the newly created database

CREATE TABLE "session" (
  "sid" VARCHAR NOT NULL COLLATE "default",
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  PRIMARY KEY ("sid")
);
