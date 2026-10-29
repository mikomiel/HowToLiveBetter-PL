#!/bin/bash
set -euo pipefail

# Cloud sessions only. On a local machine follow the commands in README.md.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# Install only when this script or the dependency files changed since the last successful install.
hashes=node_modules/.session-start.sha256
if ! sha256sum --check --status "$hashes" 2>/dev/null; then
  # Delete the old hashes first, so a failed install runs again next time.
  rm -f "$hashes"
  npm ci --ignore-scripts --no-audit --no-fund
  sha256sum .claude/hooks/session-start.sh package.json package-lock.json > "$hashes"
fi

# The browser lives outside the repository, so the check above cannot cover it. This is a no-op when the pinned build exists.
# A failure is reported but does not stop the session: unit tests and content work do not need the browser.
if ! npx --no-install playwright install chromium > /dev/null 2>&1; then
  echo "WARNING: could not install the pinned Chromium (needs cdn.playwright.dev and storage.googleapis.com). npm test works; npm run test:browser will not." >&2
fi

# One line on which source hosts this session can reach, so verification work starts from facts.
probe() {
  code=$(curl -s -o /dev/null -m 5 -w '%{http_code}' -A 'pl-edition-source-probe/1.0' "https://$1/" 2> /dev/null || true)
  case "$code" in 2* | 3*) echo "$1:ok" ;; *) echo "$1:BLOCKED($code)" ;; esac
}
export -f probe
hosts="doi.org www.ebi.ac.uk api.crossref.org api.sejm.gov.pl www.gov.pl wiedza.cert.pl"
echo "Source access:" $(printf '%s\n' $hosts | xargs -P 6 -I{} bash -c 'probe {}' | sort | tr '\n' ' ')
