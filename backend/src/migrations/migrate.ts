import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const migrationDir = path.join(__dirname, "DbMigrations");
const MONDO_DB_CONNECT = process.env.MONDO_DB_CONNECT!;

const migrationSchema = new mongoose.Schema({
  name: String,
  runAt: { type: Date, default: Date.now },
});

const Migration = mongoose.model("Migration", migrationSchema);

async function runMigrations() {
  await mongoose.connect(MONDO_DB_CONNECT);
  console.log("Connected to MongoDB");

  const files = fs.readdirSync(migrationDir).sort();

  for (const file of files) {
    const alreadyRun = await Migration.findOne({ name: file });
    if (alreadyRun) {
      console.log(`Skipping already run: ${file}`);
      continue;
    }

    const migrationPath = path.join(migrationDir, file);
    const { up } = require(migrationPath);

    if (typeof up === "function") {
      console.log(`Running migration: ${file}`);
      await up();
      await Migration.create({ name: file });
    }
  }

  await mongoose.disconnect();
  console.log("All migrations completed");
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
