const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const dbPath = path.join(__dirname, "..", "data", "cyberedukz.sqlite");

if (!fs.existsSync(dbPath)) {
  console.log("No local database found. Start the server once to create seed data.");
  process.exit(0);
}

const db = new DatabaseSync(dbPath);
db.exec("BEGIN IMMEDIATE");
try {
  db.exec("DELETE FROM submissions");
  db.prepare("DELETE FROM users WHERE email <> ?").run("admin@cyberedukz.local");
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
} finally {
  db.close();
}

console.log("Demo users and submissions were reset. Admin account and content were kept.");
