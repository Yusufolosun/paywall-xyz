#!/bin/bash
set -e

HOOKS_DIR=".git/hooks"

cat > "$HOOKS_DIR/commit-msg" << 'EOF'
#!/bin/bash

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

PATTERN="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,72}"

if ! echo "$COMMIT_MSG" | grep -qE "$PATTERN"; then
  echo "ERROR: Commit message does not follow conventional format"
  echo "Format: type(scope): description"
  echo "Types: feat, fix, docs, style, refactor, test, chore"
  echo "Example: feat(widget): add wallet connection"
  exit 1
fi
EOF

chmod +x "$HOOKS_DIR/commit-msg"

cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

echo "Running pre-commit checks..."

if [ -d "widget" ]; then
  cd widget
  if [ -f "package.json" ]; then
    npm run build > /dev/null 2>&1
    if [ $? -ne 0 ]; then
      echo "ERROR: Widget build failed"
      exit 1
    fi
  fi
  cd ..
fi

if [ -d "backend" ]; then
  cd backend
  if [ -f "package.json" ]; then
    npm run build > /dev/null 2>&1
    if [ $? -ne 0 ]; then
      echo "ERROR: Backend build failed"
      exit 1
    fi
  fi
  cd ..
fi

echo "Pre-commit checks passed"
EOF

chmod +x "$HOOKS_DIR/pre-commit"

echo "Git hooks installed successfully"
