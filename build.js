#!/usr/bin/env node
// Sync turtle bodies from core/ submodule and stamp opencode agent frontmatter.
// Run: node build.js [--dry-run]
const fs = require('fs');
const path = require('path');

const CORE = path.join(__dirname, 'core');
const DRY = process.argv.includes('--dry-run');

const TURTLES = {
  splinter:     { description: 'Ratman orchestrator — analyses the task, picks the right turtle(s), coordinates the squad. Usage: invoke splinter <task>', mode: 'all',   tools: { bash: true, read: true, glob: true, grep: true, task: true, write: true, edit: true } },
  turtleman:    { description: 'Activate Turtleman development mode — calm, direct, siege-specialist precision, TMNT squad deployed via Splinter. Usage: invoke turtleman <task>', mode: 'all',   tools: { bash: true, read: true, glob: true, grep: true, task: true } },
  donatello:    { description: 'Donatello — tech and tooling specialist. Automates everything, wires up pipelines, fixes infra nobody else wants to touch. Usage: invoke donatello <task>', mode: 'subagent', tools: { bash: true, read: true, edit: true, write: true, glob: true, grep: true, task: true } },
  leonardo:     { description: 'Leonardo — plans, leads, coordinates. Designs the approach before touching code. Usage: invoke leonardo <task>', mode: 'subagent', tools: { bash: true, read: true, glob: true, grep: true, task: true } },
  raphael:      { description: 'Raphael — gets things done fast. No patience for bureaucracy. Ships the fix, documents it briefly, moves on. Usage: invoke raphael <task>', mode: 'subagent', tools: { bash: true, read: true, edit: true, write: true, glob: true, grep: true, task: true } },
  michelangelo: { description: 'Michelangelo — creative lateral thinker. Finds the unexpected angle, the meme solution, the elegant shortcut. Usage: invoke michelangelo <task>', mode: 'subagent', tools: { bash: true, read: true, glob: true, grep: true, task: true } },
  shredder:     { description: 'Shredder — devil\'s advocate. Tears apart the plan, finds what breaks, challenges every assumption. If Shredder approves it, it ships. Usage: invoke shredder <plan or diff>', mode: 'subagent', tools: { bash: true, read: true, glob: true, grep: true, task: true } },
  vernon:       { description: 'Vernon — Socratic requirement enforcer. Intercepts vague tasks and asks targeted questions until requirements are specific enough to hand to Splinter. Usage: invoke vernon <task>', mode: 'subagent', tools: { read: true } },
};

let ok = true;

// Lightweight YAML frontmatter validator (no dependencies)
function validateFrontmatter(content, label) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) { console.error('FAIL:', label, '— no YAML frontmatter found'); return false; }
  const fm = fmMatch[1];
  // Check for YAML-breaking characters in values (unescaped colons, hashes at line start)
  for (const line of fm.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    // A value containing ': ' mid-string is fine, but a line starting with a bare key without ':' is suspicious
    if (/^[^:]+$/.test(trimmed) && !trimmed.endsWith(':')) {
      console.error('WARN:', label, '— suspicious YAML line:', trimmed);
    }
  }
  return true;
}
for (const [name, meta] of Object.entries(TURTLES)) {
  const bodyPath = path.join(CORE, 'turtles', name + '.md');
  const outPath  = path.join(__dirname, '.opencode', 'agent', name + '.md');

  if (!fs.existsSync(bodyPath)) { console.error('MISSING core body:', bodyPath); ok = false; continue; }

  const body = fs.readFileSync(bodyPath, 'utf8').replace(/\r\n/g, '\n');

  // Build YAML frontmatter
  const toolsYaml = Object.entries(meta.tools)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join('\n');
  const out = `---\ndescription: "${meta.description}"\nmode: ${meta.mode}\ntools:\n${toolsYaml}\n---\n${body}`;

  if (!validateFrontmatter(out, name)) ok = false;

  if (DRY) {
    const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
    if (current !== out) {
      console.log('DIFF:', name);
      ok = false;
    } else {
      console.log('OK  :', name);
    }
  } else {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, out);
    console.log('wrote:', name);
  }
}

// Sync shared dojo → SKILL.md
const dojoSrc = path.join(CORE, 'turtle-dojo.md');
const dojoDst = path.join(__dirname, '.opencode', 'skills', 'turtle-dojo', 'SKILL.md');
if (fs.existsSync(dojoSrc)) {
  const body = fs.readFileSync(dojoSrc, 'utf8').replace(/\r\n/g, '\n');
  const skillFrontmatter = `---
name: turtle-dojo
description: "Shared rules for all TMNT turtles — Git rules, cross-ticket strategy, subagent patterns, MCP configuration, and prompt injection vigilance."
metadata:
  source: "Converted from Claude Code plugin format. Original author: Martin Tomecka (tommaone)."
---
`;
  const out = skillFrontmatter + body;

  if (!validateFrontmatter(out, 'SKILL.md')) ok = false;

  if (DRY) {
    const current = fs.existsSync(dojoDst) ? fs.readFileSync(dojoDst, 'utf8') : '';
    if (current !== out) { console.log('DIFF: turtle-dojo SKILL.md'); ok = false; }
    else console.log('OK  : turtle-dojo SKILL.md');
  } else {
    fs.mkdirSync(path.dirname(dojoDst), { recursive: true });
    fs.writeFileSync(dojoDst, out);
    console.log('wrote: turtle-dojo SKILL.md');
  }
}

if (DRY) process.exit(ok ? 0 : 1);
