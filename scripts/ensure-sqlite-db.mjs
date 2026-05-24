import fs from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env");

function readDatabaseUrl() {
  if (!fs.existsSync(envPath)) return process.env.DATABASE_URL;

  const env = fs.readFileSync(envPath, "utf8");
  const line = env
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith("DATABASE_URL="));

  if (!line) return process.env.DATABASE_URL;

  return line
    .slice(line.indexOf("=") + 1)
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

const url = readDatabaseUrl();

if (url?.startsWith("file:")) {
  const target = url.slice("file:".length);
  const dbPath = target.startsWith(".")
    ? path.resolve(process.cwd(), "prisma", target)
    : path.resolve(target);

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.closeSync(fs.openSync(dbPath, "a"));
  console.log(`SQLite database file ready at ${dbPath}`);
}
