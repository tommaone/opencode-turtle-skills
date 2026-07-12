# 🐢 opencode-turtle-skills

TMNT turtle squad for [opencode](https://opencode.ai) — siege-specialist development style with local AI.

## The Squad

| Agent | Role | Mode |
|-------|------|------|
| turtleman 🐢 | Top-level siege specialist mode | primary |
| splinter 🐀 | Ratman orchestrator — dispatches turtles | all |
| vernon 🐸 | Socratic requirement enforcer | subagent |
| leonardo 🔵 | Architect/planner, produces change docs | subagent |
| donatello 🟣 | Tech/tooling implementer | subagent |
| raphael 🔴 | Fast bug fixer | subagent |
| michelangelo 🟠 | Creative lateral thinker | subagent |
| shredder ⚔️ | Adversarial gatekeeper/reviewer | subagent |

## Stack

```
Host:    Windows gaming PC (RTX 4070)
Engine:  Ollama (Windows native) → http://localhost:11434
Model:   qwen2.5-coder:7b
Client:  OpenCode (WSL/Ubuntu)
```

## Setup

### 1. Ollama (Windows host)

Install [Ollama](https://ollama.com), pull the model:

```powershell
ollama pull qwen2.5-coder:7b
```

Verify the API:

```powershell
curl http://localhost:11434/api/tags
```

### 2. OpenCode (WSL/Ubuntu)

```bash
sudo apt update && sudo apt install -y curl git python3 python3-pip
curl -fsSL https://opencode.ai/install | bash
source ~/.bashrc
```

If `opencode` isn't found after install:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 3. Configure OpenCode

OpenCode reads its config from `~/.config/opencode/opencode.jsonc`. Use the [example config](opencode.example.jsonc) from this repo as a starting point:

```bash
mkdir -p ~/.config/opencode
cp opencode.example.jsonc ~/.config/opencode/opencode.jsonc
```

Then edit the config to:

- Set `baseURL` to your Ollama address (WSL: `http://192.168.16.1:11434/v1`, same machine: `http://localhost:11434/v1`, remote: `http://<ip>:11434/v1`)
- Update `instructions` and `skills.paths` to your local checkout path

### 4. Run

```bash
cd ~/turtle
opencode
```

## Architecture

```
User → OpenCode CLI → Ollama API → Qwen2.5-Coder 7B
                   → WSL Filesystem
                   → Bash / Processes

OpenCode = orchestrator + tool runtime
Ollama   = reasoning model backend
WSL      = execution environment
Skills   = behavior layer for structured workflows
```

## Philosophy

> *"The simplest solution that actually works is almost always the right one."*

**Siege specialist creed:** Methodical, precise, no interest in glory — just getting through the wall. The room isn't on fire. It's already been fixed. You just haven't mentioned it yet.

## Evolution Layer

Lessons from each session are distilled and committed to each turtle's Hall of Fame (or Hall of Dishonor for Shredder) in their agent files. Universal rules go into the dojo skill at `.opencode/skills/turtle-dojo/SKILL.md`.

Recent additions:
- **Formula transparency** — engine output carries `_formula` metadata (model, scope, blind spots). LLM cites formula context instead of blindly trusting numbers.
- **Answer modulation** — LLM calibrates confidence based on gap between model scope and user intent. Data + metadata → calibrated response.
- **No backticks in template literals** — markdown code fences inside JS template literals cause SyntaxError. Use indentation.
- **No epistemic collapse** — conclusions inherit uncertainty from analysis layer.

---

## Optional: Permanent Activation

If you want the turtle-dojo rules loaded on **every** opencode session (not just inside this repo), add these to `~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "instructions": [
    "/home/you/opencode-turtle-skills/.opencode/skills/turtle-dojo/SKILL.md"
  ],
  "skills": {
    "paths": [
      "/home/you/opencode-turtle-skills/.opencode/skills/turtle-dojo"
    ]
  }
}
```

`instructions` injects the rules into every session's system prompt. `skills.paths` makes the skill discoverable for ad-hoc loading. Adjust the path to your turtle repo location.

### 5. Make Turtleman the default agent

Symlink the turtleman agent into opencode's global agents directory and set it as default:

```bash
# Create the agents directory
mkdir -p ~/.config/opencode/agents

# Symlink turtleman from this repo
ln -s /path/to/opencode-turtle-skills/.opencode/agent/turtleman.md ~/.config/opencode/agents/turtleman.md
```

Then add `default_agent` to `~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "default_agent": "turtleman"
}
```

Turtleman loads automatically on every opencode start. The symlink keeps the git repo as the single source of truth — pull updates and they apply immediately.

---

## Related repos

| Platform | Repo |
|----------|------|
| Claude Code | [tommaone/claude-skills](https://github.com/tommaone/claude-skills) |
| GitHub Copilot CLI | [tommaone/copilot-turtle-skills](https://github.com/tommaone/copilot-turtle-skills) |
| opencode | [tommaone/opencode-turtle-skills](https://github.com/tommaone/opencode-turtle-skills) ← you are here |
| Kiro | [tommaone/kiro-turtle-skills](https://github.com/tommaone/kiro-turtle-skills) |

---

*Converted from Claude Code plugin format. Original author: [@tommaone](https://github.com/tommaone).*
