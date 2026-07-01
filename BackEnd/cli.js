#!/usr/bin/env node

import fs from "fs/promises";
import Prism from "prismjs";
import chalk from "chalk";


import "prismjs/components/prism-c.js";
import "prismjs/components/prism-cpp.js";
import "prismjs/components/prism-java.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-json.js";

import { generateContent } from "./src/services/ai.service.js";

const args = process.argv.slice(2);
const save = args.includes("--save");
const file = args.find(arg => arg !== "--save");

if (!file) {
  console.error("Usage: review <file> [--save]");
  process.exit(1);
}

try {
  await fs.access(file);
} catch {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

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
console.log("Analyzing...");

try {
  const content = await fs.readFile(file, "utf8");
  const review = await generateContent(content);

  console.log("\n" + highlightMarkdown(review));

  if (save) {
    await fs.writeFile("review_report.md", review, "utf8");
    console.log("\nSaved to review_report.md");
  }
} catch (error) {
  console.error(`Error processing review: ${error.message}`);
  process.exit(1);
}
