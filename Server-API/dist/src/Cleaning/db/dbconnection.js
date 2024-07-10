"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTransaction = exports.query = void 0;
// connection pool.
const pg_1 = require("pg");
// db configuration details.
const dbconfig_1 = __importDefault(require("./dbconfig"));
const pool = new pg_1.Pool(dbconfig_1.default);
/**
 * Executes a query against the database.
 *
 * @param text The query
 * @param params The parameters to insert into the query
 * @returns The result of the query.
 */
const query = (text, params) => pool.query(text, params);
exports.query = query;
/**
 * Executes a transaction against the database.
 * Takes a callback function that contains the queries to execute as part of the transaction.
 *
 * @param transactionQueries A callback function that receives a database client and executes the queries.
 * @throws An error if any of the queries fail or if the transaction cannot be committed.
 */
const executeTransaction = async (transactionQueries) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN;");
        const result = await transactionQueries(client);
        await client.query("COMMIT;");
        return result;
    }
    catch (err) {
        await client.query("ROLLBACK;");
        throw err;
    }
    finally {
        client.release();
    }
};
exports.executeTransaction = executeTransaction;
pool.on("connect", () => console.log("Connected to the database."));
pool.on("error", (err) => {
    console.log("Unexpected error on idle client", err);
    // Exit process with status code of -1
    process.exit(-1);
});
