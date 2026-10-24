import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const ROOT = process.cwd();
const TARGET_DIRS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts", ".cts"]);

const PATTERNS = [
  { label: "inline style prop", regex: /style=\s*\{\{/ },
  { label: "<style> tag", regex: /<style[\s>]/ },
  { label: "styled-jsx", regex: /styled-jsx/ },
];

function collectFiles(dir) {
  const files = [];

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;

    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full));
    } else if (EXTENSIONS.has(extname(entry.name))) {
      files.push(full);
    }
  }

  return files;
}

const violations = [];

for (const dir of TARGET_DIRS) {
  for (const file of collectFiles(join(ROOT, dir))) {
    const content = readFileSync(file, "utf8");
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const { label, regex } of PATTERNS) {
        if (regex.test(line)) {
          violations.push({
            file: relative(ROOT, file).replace(/\\/g, "/"),
            line: index + 1,
            label,
            text: line.trim(),
          });
        }
      }
    });
  }
}

if (violations.length > 0) {
  console.error("check:styles failed — forbidden styling found:\n");
  for (const violation of violations) {
    console.error(
      `  ${violation.file}:${violation.line}  ${violation.label}  ${violation.text}`,
    );
  }
  console.error(
    "\nUse Tailwind utility classes only (use cn() from lib/cn.ts for conditional classes).",
  );
  process.exit(1);
}

console.log("check:styles passed — no inline styles, <style> tags or styled-jsx found.");
