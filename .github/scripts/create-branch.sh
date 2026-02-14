#!/bin/bash
set -e

if [ $# -lt 1 ]; then
  echo "Usage: ./create-branch.sh <issue-number>"
  exit 1
fi

ISSUE_NUM="$1"

ISSUE_TITLE=$(gh issue view "$ISSUE_NUM" --json title -q .title)

# Create a clean slug from issue title (max 50 chars)
SLUG=$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | cut -c1-50 | sed 's/-$//')

# Determine branch type based on issue labels
LABELS=$(gh issue view "$ISSUE_NUM" --json labels -q '.labels[].name' | tr '\n' ',')

if [[ $LABELS == *"bug"* ]]; then
  BRANCH_TYPE="fix"
elif [[ $LABELS == *"documentation"* ]]; then
  BRANCH_TYPE="docs"
elif [[ $LABELS == *"chore"* ]]; then
  BRANCH_TYPE="chore"
else
  BRANCH_TYPE="feat"
fi

BRANCH_NAME="${BRANCH_TYPE}/${SLUG}"

git checkout -b "$BRANCH_NAME"

echo "Created and switched to branch: $BRANCH_NAME"
echo "Issue #$ISSUE_NUM: $ISSUE_TITLE"
echo "Branch type: $BRANCH_TYPE"
