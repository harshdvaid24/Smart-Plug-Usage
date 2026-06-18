# Claude Code → GLM-5.2 launcher

A small, **isolated** helper to run [Claude Code](https://claude.ai/code) against
the **GLM-5.2** model instead of Anthropic's API — via **ZenMux** (default) or
**Z.ai** directly. Both expose an Anthropic-compatible endpoint.

This is unrelated to the Smart-Plug app — it's a standalone dev tool kept in its
own folder so it never touches the app code or the orchestrating web session.

## What this is

"Open Claude with GLM-5.2" isn't a separate product. GLM-5.2 (released
2026-06-13 by Z.ai — a ~753B-param MoE with a 1M-token context, coding-first) is
served through an **Anthropic-compatible API**. So Claude Code can drive it with
nothing more than a base-URL swap and a model mapping — no code changes.

`setup-glm.sh` sets these for the `claude` process only (values shown for the
default ZenMux provider; `GLM_PROVIDER=zai` switches to direct Z.ai):

| Variable | ZenMux (default) | Z.ai (`GLM_PROVIDER=zai`) |
| --- | --- | --- |
| `ANTHROPIC_BASE_URL` | `https://zenmux.ai/api/anthropic` | `https://api.z.ai/api/anthropic` |
| `ANTHROPIC_AUTH_TOKEN` | your key | your key |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | `glm-5.2[1m]` | `glm-5.2` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | `glm-5.2[1m]` | `glm-5.2` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | `glm-4.5-air` | `glm-4.5-air` |
| `API_TIMEOUT_MS` | `3000000` | `3000000` |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | `1000000` | `1000000` |
| `CLAUDE_CONFIG_DIR` | `~/.claude-glm` (separate from a normal install) | same |

The key is read from `GLM_API_KEY` (or `ZENMUX_API_KEY` / `ZAI_API_KEY`).

## Prerequisites

1. **Network egress to the provider host.** In a sandbox/web session, add the
   host (`zenmux.ai` for ZenMux, or `api.z.ai` for Z.ai) to the environment's
   network egress allowlist, then start a **fresh session** (network policy is
   applied at container start). Docs:
   <https://code.claude.com/docs/en/claude-code-on-the-web>
2. **An API key.** ZenMux: <https://zenmux.ai> · Z.ai: <https://z.ai>. Provide it
   via `GLM_API_KEY` — prefer an environment secret over pasting it where it
   could be logged.

## Usage

```bash
export GLM_API_KEY=your_key            # your ZenMux or Z.ai key

./glm-claude/setup-glm.sh              # interactive Claude Code on GLM-5.2 (ZenMux)
./glm-claude/setup-glm.sh -p "ping"    # one-shot prompt; any claude flag passes through
GLM_PROVIDER=zai ./glm-claude/setup-glm.sh   # use Z.ai directly instead
```

## Notes

- **Keep it scoped.** Don't set `ANTHROPIC_BASE_URL` globally in your environment
  config — that would also route the orchestrating web agent through GLM-5.2,
  which can affect tool-calling/harness behavior. This launcher keeps the
  routing on the `claude` process only.
- Config/values verified against ZenMux and Z.ai Claude Code setup docs (June 2026).
