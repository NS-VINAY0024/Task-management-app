const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const distDir = path.join(__dirname, "..", "dist");

const collectTestFiles = (directory) => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectTestFiles(fullPath);
    }

    return entry.name.endsWith(".test.js") ? [fullPath] : [];
  });
};

const testFiles = fs.existsSync(distDir) ? collectTestFiles(distDir) : [];

if (testFiles.length === 0) {
  console.error("No compiled test files found in dist.");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
