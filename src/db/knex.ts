import knex from "knex";
import config from "../../knexfile"; // root’taki knexfile.ts

const db = knex(config.development);

export default db;
