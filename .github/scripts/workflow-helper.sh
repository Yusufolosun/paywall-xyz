#!/bin/bash

show_help() {
  echo "PayWall.xyz Workflow Helper"
  echo ""
  echo "Usage: ./workflow-helper.sh <command> [args]"
  echo ""
  echo "Commands:"
  echo "  start <issue-num>  - Create branch from issue and start work"
  echo "  finish <issue-num> - Create PR from current branch"
  echo "  list               - List all open issues"
  echo "  status             - Show current branch and issue"
  echo ""
}

start_work() {
  ISSUE_NUM=$1
  ./.github/scripts/create-branch.sh "$ISSUE_NUM"
  gh issue develop "$ISSUE_NUM" --checkout
}

finish_work() {
  ISSUE_NUM=$1
  git push -u origin HEAD
  ./.github/scripts/create-pr.sh "$ISSUE_NUM"
}

list_issues() {
  gh issue list --state open
}

show_status() {
  BRANCH=$(git branch --show-current)
  echo "Current branch: $BRANCH"
  
  # Try to find associated issue from branch name or commits
  echo ""
  echo "Recent commits:"
  git log --oneline -3
  
  echo ""
  echo "Linked issues:"
  gh pr list --head "$BRANCH" --json number,title,url 2>/dev/null || echo "No PR found for this branch"
}

case "$1" in
  start)
    start_work "$2"
    ;;
  finish)
    finish_work "$2"
    ;;
  list)
    list_issues
    ;;
  status)
    show_status
    ;;
  *)
    show_help
    ;;
esac
