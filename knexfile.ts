import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "root123",
      database: "karaburun",
    },
    migrations: {
      directory: "./migrations",
    },
  },
};

export default config;
