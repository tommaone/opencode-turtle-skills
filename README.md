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

```bash
mkdir -p ~/.opencode
```

Create `~/.opencode/config.json`:

```json
{
  "provider": "openai-compatible",
  "base_url": "http://192.168.16.1:11434/v1",
  "model": "qwen2.5-coder:7b"
}
```

> Replace the IP with your Ollama host's LAN address if running on a separate machine.

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

Personal learning logs live in `.opencode/skills/turtle-dojo/*.md` — one file per turtle, never committed to git. Lessons accumulate as you work together.

---

*Converted from Claude Code plugin format. Original author: [@tommaone](https://github.com/tommaone).*
