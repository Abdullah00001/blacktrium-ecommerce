const fs = require("fs");
const path = require("path");

// Define source directory
const srcModulesDir = path.join(__dirname, "..", "schemas", "modules");

// Define destination directories
const destinations = [
  path.join(__dirname, "..", "server", "src", "app", "schemas"),
  path.join(__dirname, "..", "worker", "src", "app", "schemas"),
  path.join(__dirname, "..", "cron", "src", "app", "schemas"),
];

function syncSchemas() {
  if (!fs.existsSync(srcModulesDir)) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `Error: Source directory directy not found at ${srcModulesDir}`,
    );
    process.exit(1);
  }

  console.log("\x1b[36m%s\x1b[0m", "🔄 Syncing schemas across services...");

  destinations.forEach((dest) => {
    try {
      // 1. Clear out the old destination directory entirely to prevent stale files
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }

      // 2. Ensure parent structure exists
      fs.mkdirSync(dest, { recursive: true });

      // 3. Copy modules folder contents over
      fs.cpSync(srcModulesDir, dest, { recursive: true });

      // Get relative path for cleaner logs
      const relativeDest = path.relative(path.join(__dirname, ".."), dest);
      console.log(`\x1b[32m✔ Synced:\x1b[0m ${relativeDest}`);
    } catch (err) {
      console.error("\x1b[31m%s\x1b[0m", `Failed to sync to ${dest}:`, err);
    }
  });

  console.log("\x1b[34m%s\x1b[0m", "\n✨ All services successfully synced!");
}

syncSchemas();
