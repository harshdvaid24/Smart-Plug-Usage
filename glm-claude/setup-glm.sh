#!/usr/bin/env bash
#
# setup-glm.sh — Launch Claude Code routed to Z.ai's GLM-5.2 model.
#
# This is an ISOLATED launcher: it only sets environment variables for the
# `claude` process it starts and uses its own config dir, so it never changes
# a normal/global Claude Code installation or this repo's environment.
#
# GLM-5.2 is exposed through Z.ai's Anthropic-compatible API, so Claude Code
# works against it with nothing but a base-URL swap + model mapping.
#
# Prerequisites:
#   1. Network egress to `api.z.ai` must be allowed.
#      In Claude Code on the web, add `api.z.ai` to the environment's network
#      egress allowlist, then start a fresh session.
#      Docs: https://code.claude.com/docs/en/claude-code-on-the-web
#   2. A Z.ai API key, provided via the ZAI_API_KEY environment variable.
#      Get one at https://z.ai (API keys). Prefer setting it as an environment
#      secret rather than pasting it anywhere it could be logged.
#
# Usage:
#   export ZAI_API_KEY=your_zai_key
#   ./glm-claude/setup-glm.sh                 # interactive Claude Code on GLM-5.2
#   ./glm-claude/setup-glm.sh -p "ping"       # one-shot prompt (any claude flags pass through)
#
set -euo pipefail

# ---- Configuration (verified against Z.ai's Claude Code docs) ----
ZAI_BASE_URL="https://api.z.ai/api/anthropic"
MODEL_OPUS="glm-5.2"        # heavyweight slot -> GLM-5.2
MODEL_SONNET="glm-5.2"      # mid slot         -> GLM-5.2
MODEL_HAIKU="glm-4.5-air"   # fast/cheap slot  -> GLM-4.5-Air

# ---- Preconditions ----
if ! command -v claude >/dev/null 2>&1; then
  echo "ERROR: 'claude' (Claude Code) is not installed or not on PATH." >&2
  echo "  Install: curl -fsSL https://claude.ai/install.sh | bash" >&2
  exit 127
fi

if [ -z "${ZAI_API_KEY:-}" ]; then
  echo "ERROR: ZAI_API_KEY is not set." >&2
  echo "  export ZAI_API_KEY=your_zai_key   # get one at https://z.ai" >&2
  exit 1
fi

# ---- Egress preflight (non-fatal warning) ----
probe="$(curl -sS -m 8 -o /dev/null -w '%{http_code}' "$ZAI_BASE_URL/v1/messages" \
  -H 'content-type: application/json' -H 'anthropic-version: 2023-06-01' \
  -H 'x-api-key: preflight' \
  -d '{"model":"glm-5.2","max_tokens":1,"messages":[{"role":"user","content":"x"}]}' 2>/dev/null || echo 000)"
if [ "$probe" = "403" ] && curl -sS -m 8 "$ZAI_BASE_URL/v1/messages" 2>/dev/null | grep -qi 'not in allowlist'; then
  echo "WARNING: egress to api.z.ai appears blocked by this environment's network policy." >&2
  echo "         Add 'api.z.ai' to the egress allowlist and start a new session." >&2
fi

# ---- Route Claude Code at GLM-5.2 (scoped to this process only) ----
export ANTHROPIC_BASE_URL="$ZAI_BASE_URL"
export ANTHROPIC_AUTH_TOKEN="$ZAI_API_KEY"
export ANTHROPIC_DEFAULT_OPUS_MODEL="$MODEL_OPUS"
export ANTHROPIC_DEFAULT_SONNET_MODEL="$MODEL_SONNET"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="$MODEL_HAIKU"
export API_TIMEOUT_MS="3000000"   # GLM-5.2 can be slow on long-horizon agentic tasks

# Keep GLM sessions in their own config dir so they don't clobber a normal install.
export CLAUDE_CONFIG_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude-glm}"
mkdir -p "$CLAUDE_CONFIG_DIR"

echo "Launching Claude Code -> GLM-5.2  (base: $ANTHROPIC_BASE_URL, config: $CLAUDE_CONFIG_DIR)"
exec claude "$@"
