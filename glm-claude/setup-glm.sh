#!/usr/bin/env bash
#
# setup-glm.sh — Launch Claude Code routed to GLM-5.2 via an
# Anthropic-compatible provider (ZenMux by default, or Z.ai directly).
#
# This is an ISOLATED launcher: it only sets environment variables for the
# `claude` process it starts and uses its own config dir, so it never changes
# a normal/global Claude Code installation or this repo's environment.
#
# GLM-5.2 is exposed through Anthropic-compatible APIs, so Claude Code works
# against it with nothing but a base-URL swap + model mapping (no code changes).
#
# Providers (set GLM_PROVIDER):
#   zenmux  (default) -> base https://zenmux.ai/api/anthropic , model glm-5.2[1m]
#   zai               -> base https://api.z.ai/api/anthropic  , model glm-5.2
#
# Prerequisites:
#   1. Network egress to the provider host must be allowed.
#      In Claude Code on the web, add the host (e.g. `zenmux.ai`) to the
#      environment's network egress allowlist, then start a fresh session.
#      Docs: https://code.claude.com/docs/en/claude-code-on-the-web
#   2. An API key for the chosen provider, in the GLM_API_KEY env var
#      (ZENMUX_API_KEY / ZAI_API_KEY are also accepted). Prefer an environment
#      secret over pasting the key anywhere it could be logged.
#
# Usage:
#   export GLM_API_KEY=sk-...                 # your ZenMux (or Z.ai) key
#   ./glm-claude/setup-glm.sh                 # interactive Claude Code on GLM-5.2
#   ./glm-claude/setup-glm.sh -p "ping"       # one-shot prompt (claude flags pass through)
#   GLM_PROVIDER=zai ./glm-claude/setup-glm.sh
#
set -euo pipefail

# ---- Resolve the API key from any of the accepted env vars ----
API_KEY="${GLM_API_KEY:-${ZENMUX_API_KEY:-${ZAI_API_KEY:-}}}"

# ---- Provider config (verified against ZenMux / Z.ai Claude Code docs) ----
PROVIDER="${GLM_PROVIDER:-zenmux}"
case "$PROVIDER" in
  zenmux)
    BASE_URL="https://zenmux.ai/api/anthropic"
    MODEL_MAIN="glm-5.2[1m]"   # 1M-context variant
    MODEL_FAST="glm-4.5-air"
    ;;
  zai)
    BASE_URL="https://api.z.ai/api/anthropic"
    MODEL_MAIN="glm-5.2"
    MODEL_FAST="glm-4.5-air"
    ;;
  *)
    echo "ERROR: unknown GLM_PROVIDER='$PROVIDER' (use 'zenmux' or 'zai')." >&2
    exit 2
    ;;
esac

# ---- Preconditions ----
if ! command -v claude >/dev/null 2>&1; then
  echo "ERROR: 'claude' (Claude Code) is not installed or not on PATH." >&2
  echo "  Install: curl -fsSL https://claude.ai/install.sh | bash" >&2
  exit 127
fi

if [ -z "$API_KEY" ]; then
  echo "ERROR: no API key found." >&2
  echo "  export GLM_API_KEY=your_${PROVIDER}_key   # or ZENMUX_API_KEY / ZAI_API_KEY" >&2
  exit 1
fi

# ---- Egress preflight (non-fatal warning) ----
host="$(printf '%s' "$BASE_URL" | sed -E 's#^https?://([^/]+).*#\1#')"
body="$(curl -sS -m 8 "$BASE_URL/v1/models" 2>/dev/null || true)"
if printf '%s' "$body" | grep -qi 'not in allowlist'; then
  echo "WARNING: egress to $host appears blocked by this environment's network policy." >&2
  echo "         Add '$host' to the egress allowlist and start a new session." >&2
fi

# ---- Route Claude Code at GLM-5.2 (scoped to this process only) ----
export ANTHROPIC_BASE_URL="$BASE_URL"
export ANTHROPIC_AUTH_TOKEN="$API_KEY"
export ANTHROPIC_DEFAULT_OPUS_MODEL="$MODEL_MAIN"
export ANTHROPIC_DEFAULT_SONNET_MODEL="$MODEL_MAIN"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="$MODEL_FAST"
export API_TIMEOUT_MS="3000000"               # GLM-5.2 can be slow on long agentic tasks
export CLAUDE_CODE_AUTO_COMPACT_WINDOW="1000000"  # match the 1M context window

# Keep GLM sessions in their own config dir so they don't clobber a normal install.
export CLAUDE_CONFIG_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude-glm}"
mkdir -p "$CLAUDE_CONFIG_DIR"

echo "Launching Claude Code -> GLM-5.2 via $PROVIDER ($ANTHROPIC_BASE_URL, model $MODEL_MAIN)"
exec claude "$@"
