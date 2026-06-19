const fs = require("fs");
const path = require("path");

// 1. Grab the module name from the command line arguments
const moduleInput = process.argv[2];

if (!moduleInput) {
  console.error("\x1b[31m%s\x1b[0m", "Error: Please provide a module name.");
  console.log("Usage: node scripts/create-module.js <module-name>");
  process.exit(1);
}

// Helper to normalize naming conventions
const toKebabCase = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const toCamelCase = (str) =>
  toKebabCase(str).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const toPascalCase = (str) => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const folderName = toKebabCase(moduleInput); // e.g., "product-variant"
const pascalName = toPascalCase(moduleInput); // e.g., "ProductVariant"

// 2. Target the "modules" directory inside your schemas project root
const targetDir = path.join(__dirname, "..", "modules", folderName);
const schemaFilePath = path.join(targetDir, `${folderName}.schema.ts`);
const typesFilePath = path.join(targetDir, `${folderName}.types.ts`);

// 3. File Templates
const schemaTemplate = `import { Schema, model, Model } from 'mongoose';
import { I${pascalName} } from '@/${folderName}/${folderName}.types';

const ${pascalName}Schema = new Schema<I${pascalName}>({
  // Define your schema properties here
}, {
  timestamps: true
});

export const ${pascalName}Model: Model<I${pascalName}> = model<I${pascalName}>('${pascalName}', ${pascalName}Schema);
`;

const typesTemplate = `import { Document } from 'mongoose';

export interface I${pascalName} extends Document {
  createdAt: Date;
  updatedAt: Date;
}
`;

// 4. Execution Logic
try {
  // Ensure target folder exists under /modules
  if (fs.existsSync(targetDir)) {
    console.warn(
      "\x1b[33m%s\x1b[0m",
      `Warning: Module directory "modules/${folderName}" already exists.`,
    );
  } else {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Write Schema file if it doesn't exist
  if (!fs.existsSync(schemaFilePath)) {
    fs.writeFileSync(schemaFilePath, schemaTemplate, "utf8");
    console.log(
      `\x1b[32m✔ Created:\x1b[0m modules/${folderName}/${folderName}.schema.ts`,
    );
  } else {
    console.log(
      `\x1b[33m⚠ Skipped:\x1b[0m ${folderName}.schema.ts already exists.`,
    );
  }

  // Write Types file if it doesn't exist
  if (!fs.existsSync(typesFilePath)) {
    fs.writeFileSync(typesFilePath, typesTemplate, "utf8");
    console.log(
      `\x1b[32m✔ Created:\x1b[0m modules/${folderName}/${folderName}.types.ts`,
    );
  } else {
    console.log(
      `\x1b[33m⚠ Skipped:\x1b[0m ${folderName}.types.ts already exists.`,
    );
  }

  console.log(
    "\x1b[34m%s\x1b[0m",
    `\nModule "${folderName}" initialized successfully under modules/!`,
  );
} catch (error) {
  console.error("\x1b[31m%s\x1b[0m", "Failed to generate module files:", error);
}
