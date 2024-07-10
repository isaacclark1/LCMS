// connection pool.
import { Pool, PoolClient } from "pg";
// db configuration details.
import config from "./dbconfig";

const pool = new Pool(config);

/**
 * Executes a query against the database.
 *
 * @param text The query
 * @param params The parameters to insert into the query
 * @returns The result of the query.
 */
export const query = (text: string, params?: Array<any>) => pool.query(text, params);

/**
 * Executes a transaction against the database.
 * Takes a callback function that contains the queries to execute as part of the transaction.
 *
 * @param transactionQueries A callback function that receives a database client and executes the queries.
 * @throws An error if any of the queries fail or if the transaction cannot be committed.
 */
export const executeTransaction = async (
  transactionQueries: (client: PoolClient) => Promise<any>
): Promise<any> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN;");

    const result = await transactionQueries(client);

    await client.query("COMMIT;");

    return result;
  } catch (err) {
    await client.query("ROLLBACK;");
    throw err;
  } finally {
    client.release();
  }
};

pool.on("connect", () => console.log("Connected to the database."));

pool.on("error", (err: Error) => {
  console.log("Unexpected error on idle client", err);
  // Exit process with status code of -1
  process.exit(-1);
});
