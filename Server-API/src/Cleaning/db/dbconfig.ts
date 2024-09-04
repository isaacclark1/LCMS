import dotenv from "dotenv";

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DBUSER: string;
      HOST: string;
      DATABASE: string;
      DATABASEPASSWORD: string;
      DATABASEPORT: 5433;
    }
  }
}

// Database config for development only!
const config = {
  user: process.env.DBUSER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASEPASSWORD,
  port: process.env.DATABASEPORT,
};

export default config;
