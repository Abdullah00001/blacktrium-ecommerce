const fs = require("fs");
const path = require("path");

// Define source directory
const srcModulesDir = path.join(__dirname, "..", "schemas", "modules");

// Define destination directories
const destinations = [
  path.join(__dirname, "..", "server", "src", "app", "schemas"),
  path.join(__dirname, "..", "worker", "src", "app", "schemas"),
  path.join(__dirname, "..", "corn", "src", "app", "schemas"),
];

function getSchemaModuleNames(dir) {
  if (!fs.existsSync(dir)) {
    return new Set();
  }

  return new Set(
    fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name),
  );
}

function rewriteSchemaImportPaths(filePath, content, moduleNames) {
  return content.replace(
    /(["'])@\/([^"']+)(["'])/g,
    (match, quote, aliasPath) => {
      const segments = aliasPath.split("/");
      const moduleName = segments[0];

      if (!moduleNames.has(moduleName)) {
        return match;
      }

      const normalizedPath = segments.slice(1).join("/");
      const rewrittenPath = normalizedPath
        ? `@/app/schemas/${moduleName}/${normalizedPath}`
        : `@/app/schemas/${moduleName}`;

      return `${quote}${rewrittenPath}${quote}`;
    },
  );
}

function syncSchemas() {
  if (!fs.existsSync(srcModulesDir)) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `Error: Source directory directy not found at ${srcModulesDir}`,
    );
    process.exit(1);
  }

  const moduleNames = getSchemaModuleNames(srcModulesDir);

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

      // 4. Rewrite schema alias imports so they match the service layout
      const copiedRoot = path.join(dest);
      const copiedModuleDirs = fs.readdirSync(copiedRoot, {
        withFileTypes: true,
      });

      copiedModuleDirs.forEach((entry) => {
        if (!entry.isDirectory()) {
          return;
        }

        const moduleDir = path.join(copiedRoot, entry.name);
        const files = fs.readdirSync(moduleDir, { withFileTypes: true });

        files.forEach((file) => {
          if (!file.isFile() || !file.name.endsWith(".ts")) {
            return;
          }

          const filePath = path.join(moduleDir, file.name);
          const original = fs.readFileSync(filePath, "utf8");
          const rewritten = rewriteSchemaImportPaths(
            filePath,
            original,
            moduleNames,
          );

          if (rewritten !== original) {
            fs.writeFileSync(filePath, rewritten, "utf8");
          }
        });
      });

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
