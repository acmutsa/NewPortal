import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

dotenv.config({
  path: path.resolve(currentDirectory, "../../../.env"),
});

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl) {
  throw new Error(
    "TURSO_DATABASE_URL was not found in the root .env file.",
  );
}

if (!authToken) {
  throw new Error(
    "TURSO_AUTH_TOKEN was not found in the root .env file.",
  );
}

export const database = createClient({
  url: databaseUrl,
  authToken,
});