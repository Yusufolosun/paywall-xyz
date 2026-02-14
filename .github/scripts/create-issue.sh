#!/bin/bash
set -e

if [ $# -lt 3 ]; then
  echo "Usage: ./create-issue.sh <title> <body> <milestone>"
  exit 1
fi

TITLE="$1"
BODY="$2"
MILESTONE="$3"

gh issue create \
  --title "$TITLE" \
  --body "$BODY" \
  --milestone "$MILESTONE" \
  --label "enhancement"

echo "Issue created: $TITLE"
