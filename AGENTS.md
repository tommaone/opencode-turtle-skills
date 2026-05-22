# Session notes

- YOLO++ guardrails installed globally (`~/.config/opencode/opencode.jsonc`) — full creative speed, hard stops on destruction
- All 8 turtle agents stripped of `permission: "*": allow"` — they now inherit global guardrails
- Need to restart opencode for config changes to take effect

## Project: opencode-turtle-skills

- Convert `/home/tomecka/claude-skills` (TMNT turtle squad) from Claude Code plugin format to opencode agents/skills
- New repo: `tommaone/opencode-turtle-skills`
- Each turtle becomes an opencode agent file (`.opencode/agent/<name>.md`)
- **Status: ALL 8 agents converted + turtle-dojo skill created**
- To use: invoke agents via `task` tool (e.g. `invoke splinter <task>` from turtleman mode)

### Converted agents (`.opencode/agent/`)

| Agent | Role | Mode |
|-------|------|------|
| `turtleman.md` | Top-level siege specialist mode | primary |
| `splinter.md` | Ratman orchestrator — dispatches turtles | all |
| `vernon.md` | Socratic requirement enforcer | subagent |
| `leonardo.md` | Architect/planner, produces change docs | subagent |
| `donatello.md` | Tech/tooling implementer | subagent |
| `raphael.md` | Fast bug fixer | subagent |
| `michelangelo.md` | Creative lateral thinker | subagent |
| `shredder.md` | Adversarial gate keeper/reviewer | subagent |

### Converted skills (`.opencode/skills/`)

| Skill | Description |
|-------|-------------|
| `turtle-dojo` | Shared rules — Git, cross-ticket strategy, subagent patterns, injection vigilance |

### Evolution layer (`.opencode/skills/turtle-dojo/evolution.md`)

Personal learning log system — one `.md` per turtle for lessons accumulated over time.

### TODO

- [ ] Set up repo `tommaone/opencode-turtle-skills` on GitHub
- [ ] Push to GitHub
- [ ] Create empty evolution files for each turtle
