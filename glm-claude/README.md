# Claude Code → GLM-5.2 (Z.ai) launcher

A small, **isolated** helper to run [Claude Code](https://claude.ai/code) against
Z.ai's **GLM-5.2** model instead of Anthropic's API.

This is unrelated to the Smart-Plug app — it's a standalone dev tool kept in its
own folder so it never touches the app code or the orchestrating web session.

## What this is

"Open Claude with GLM-5.2" isn't a separate product. GLM-5.2 (released
2026-06-13 by Z.ai — a ~753B-param MoE with a 1M-token context, coding-first) is
served through an **Anthropic-compatible API**. So Claude Code can drive it with
nothing more than a base-URL swap and a model mapping — no code changes.

`setup-glm.sh` sets these for the `claude` process only:

| Variable | Value |
| --- | --- |
| `ANTHROPIC_BASE_URL` | `https://api.z.ai/api/anthropic` |
| `ANTHROPIC_AUTH_TOKEN` | your `ZAI_API_KEY` |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | `glm-5.2` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | `glm-5.2` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | `glm-4.5-air` |
| `API_TIMEOUT_MS` | `3000000` |
| `CLAUDE_CONFIG_DIR` | `~/.claude-glm` (separate from a normal install) |

## Prerequisites

1. **Network egress to `api.z.ai`.** In a sandbox/web session, add `api.z.ai`
   to the environment's network egress allowlist, then start a **fresh session**
   (network policy is applied at container start). Docs:
   <https://code.claude.com/docs/en/claude-code-on-the-web>
2. **A Z.ai API key.** Get one at <https://z.ai> (API keys). Provide it via the
   `ZAI_API_KEY` environment variable — prefer an environment secret over
   pasting it where it could be logged.

## Usage

```bash
export ZAI_API_KEY=your_zai_key

./glm-claude/setup-glm.sh              # interactive Claude Code on GLM-5.2
./glm-claude/setup-glm.sh -p "ping"    # one-shot prompt; any claude flag passes through
```

## Notes

- **Keep it scoped.** Don't set `ANTHROPIC_BASE_URL` globally in your environment
  config — that would also route the orchestrating web agent through GLM-5.2,
  which can affect tool-calling/harness behavior. This launcher keeps the
  routing on the `claude` process only.
- Config/values verified against Z.ai's Claude Code setup docs (June 2026).
