#!/bin/bash
set -e

echo "1. Git status"
git status --short

echo ""
echo "2. Node syntax check"
node --check index.js
node --check webServer.js
node --check src/discussion/testDiscussion.js
node --check src/github-agent/projectAnalyze.js
node --check src/mcp/testAllMcp.js

echo ""
echo "3. GitHub Agent test"
node src/github-agent/projectAnalyze.js command

echo ""
echo "4. MCP registry test"
node src/mcp/testAllMcp.js

echo ""
echo "Health check completed."
