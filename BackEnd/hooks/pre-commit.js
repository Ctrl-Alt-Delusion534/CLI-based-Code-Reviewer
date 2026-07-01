#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";
import Prism from "prismjs";
import chalk from "chalk";


import "prismjs/components/prism-c.js";
import "prismjs/components/prism-cpp.js";
import "prismjs/components/prism-java.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-json.js";

import { generateContent } from "../src/services/ai.service.js";

const theme = {
  comment: chalk.gray,
  string: chalk.green,
  number: chalk.yellow,
  keyword: chalk.magenta,
  function: chalk.blue,
  boolean: chalk.magenta,
  class: chalk.cyan,
  builtin: chalk.cyan,
  regex: chalk.red,
  operator: chalk.cyan,
  punctuation: chalk.white,
  variable: chalk.white,
  property: chalk.blue,
  tag: chalk.blue,
  selector: chalk.blue,
  "attr-name": chalk.yellow,
  "attr-value": chalk.green,
};

function tokenToAnsi(token) {
  if (typeof token === "string") {
    return token;
  }
  const type = token.type === "class-name" ? "class" : token.type;
  const styler = theme[type];

  if (Array.isArray(token.content)) {
    const nested = token.content.map(tokenToAnsi).join("");
    if (styler) {
      return styler(nested);
    }
    return nested;
  }
  if (styler) {
    return styler(token.content);
  }
  return token.content;
}

const langMap = {
  js: "javascript",
  javascript: "javascript",
  py: "python",
  python: "python",
  cpp: "cpp",
  "c++": "cpp",
  c: "c",
  java: "java",
  bash: "bash",
  sh: "bash",
  json: "json",
};

function highlightCode(code, lang) {
  const resolvedLang = langMap[lang] || "javascript";
  const grammar = Prism.languages[resolvedLang] || Prism.languages.javascript;
  const tokens = Prism.tokenize(code, grammar);
  return tokens.map(tokenToAnsi).join("");
}

const highlightMarkdown = (markdown) => {
  // Improved regex for multiline code blocks
  return markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `\n${highlightCode(code.trim(), lang.toLowerCase())}\n`;
  });
};

let stagedFiles = [];
try {
  stagedFiles = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf-8" })
    .trim()
    .split("\n")
    .filter(Boolean);
} catch (error) {
  process.exit(0);
}

if (stagedFiles.length === 0) {
  process.exit(0);
}

const supportedExtensions = [".js", ".jsx", ".ts", ".tsx", ".cpp", ".h", ".py", ".java", ".cs", ".go", ".rs"];

const filesToReview = [];
for (const file of stagedFiles) {
  const resolvedPath = path.resolve(file);
  const ext = path.extname(resolvedPath).toLowerCase();
  if (supportedExtensions.includes(ext)) {
    try {
      await fs.access(resolvedPath);
      filesToReview.push(resolvedPath);
    } catch {
      // Ignore missing or inaccessible files
    }
  }
}

if (filesToReview.length === 0) {
  process.exit(0);
}

console.log("\nRunning Git Pre-Commit AI Code Review...");

for (const file of filesToReview) {
  try {
    const fileName = path.basename(file);
    const content = await fs.readFile(file, "utf8");

    console.log(`Reviewing ${fileName}...`);
    const review = await generateContent(content);

    console.log(`\nReview for: ${fileName}\n`);
    console.log(highlightMarkdown(review));
  } catch (error) {
    console.error(`Error reviewing ${path.basename(file)}:`, error.message || error);
  }
}

console.log("Pre-commit review complete. Proceeding with commit.\n");
