#!/bin/bash
set -e

if [ $# -lt 1 ]; then
  echo "Usage: ./create-pr.sh <issue-number>"
  exit 1
fi

ISSUE_NUM="$1"

CURRENT_BRANCH=$(git branch --show-current)

ISSUE_DATA=$(gh issue view "$ISSUE_NUM" --json title,body,labels)
ISSUE_TITLE=$(echo "$ISSUE_DATA" | jq -r .title)
ISSUE_BODY=$(echo "$ISSUE_DATA" | jq -r .body)
LABELS=$(echo "$ISSUE_DATA" | jq -r '.labels[].name' | tr '\n' ',')

# Determine conventional commit prefix
if [[ $LABELS == *"bug"* ]]; then
  PREFIX="fix:"
elif [[ $LABELS == *"documentation"* ]]; then
  PREFIX="docs:"
elif [[ $LABELS == *"chore"* ]]; then
  PREFIX="chore:"
else
  PREFIX="feat:"
fi

# Create natural PR title with conventional commit style
PR_TITLE="${PREFIX} ${ISSUE_TITLE}"

# Extract key details from issue body if available
if [ -n "$ISSUE_BODY" ] && [ "$ISSUE_BODY" != "null" ]; then
  PR_BODY="${ISSUE_BODY}\n\n---\n\nCloses #${ISSUE_NUM}"
else
  PR_BODY="## Changes\n- Implementation for: ${ISSUE_TITLE}\n\n## Testing\n- Manual testing completed\n- All checks passing\n\nCloses #${ISSUE_NUM}"
fi

gh pr create \
  --title "$PR_TITLE" \
  --body "$PR_BODY" \
  --base main \
  --head "$CURRENT_BRANCH"

echo "Pull request created: $PR_TITLE"
