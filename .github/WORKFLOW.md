# GitHub Workflow Guide

## Branch Naming Conventions

Branches are now named using **conventional commit** prefixes without issue numbers:

### Format
```
<type>/<descriptive-name>
```

### Types
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `chore/` - Maintenance tasks

### Examples
✅ **Good** (Natural & Professional)
- `feat/contract-foundation`
- `feat/wallet-integration`
- `feat/widget-core`
- `fix/transaction-verification`
- `docs/api-documentation`

❌ **Avoid** (Awkward & Verbose)
- `feature/issue-1-clarinet-setup`
- `6-setup-typescript-widget-project-with-build-pipeline`
- `fix-issue-42-broken-button`

## PR Title Conventions

PR titles use conventional commit format:

### Format
```
<type>: <description>
```

### Examples
✅ **Good**
- `feat: implement Clarity smart contract`
- `feat: add wallet connection with Stacks`
- `fix: resolve transaction polling timeout`
- `docs: add API integration guide`

❌ **Avoid**
- `Fixes #1: Setup Clarinet project and contract skeleton`
- `Issue 42 - broken button fix`

## Using the Helper Scripts

### Start Work on an Issue
```bash
./.github/scripts/workflow-helper.sh start <issue-number>
```

This will:
1. Fetch issue details
2. Create a branch with appropriate type prefix
3. Link the branch to the issue using `gh issue develop`

### Finish Work and Create PR
```bash
./.github/scripts/workflow-helper.sh finish <issue-number>
```

This will:
1. Push your branch
2. Create a PR with natural title format
3. Auto-link to the issue with "Closes #X"

### Check Status
```bash
./.github/scripts/workflow-helper.sh status
```

Shows:
- Current branch
- Recent commits
- Linked PRs

### List Open Issues
```bash
./.github/scripts/workflow-helper.sh list
```

## Manual Workflow

### 1. Create Branch
```bash
./.github/scripts/create-branch.sh <issue-number>
```

### 2. Make Changes & Commit
```bash
git add .
git commit -m "feat: implement wallet integration

- Add Stacks Connect integration
- Support multiple wallet providers
- Handle connection errors gracefully"
```

### 3. Push & Create PR
```bash
git push -u origin HEAD
./.github/scripts/create-pr.sh <issue-number>
```

## Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Example
```
feat(widget): implement payment transaction flow

- Create contract-call transactions using @stacks/transactions
- Configure STX post-conditions for payment protection
- Support both testnet and mainnet networks
- Broadcast transactions and return transaction ID

Closes #8
```

## Branch Type Selection

The script automatically selects branch type based on issue labels:

| Label | Branch Type |
|-------|-------------|
| `bug` | `fix/` |
| `documentation` | `docs/` |
| `chore` | `chore/` |
| (default) | `feat/` |

## Best Practices

1. **Keep branch names under 50 characters** - Script auto-truncates
2. **Use descriptive names** - `feat/wallet-integration` not `feat/add-stuff`
3. **One feature per branch** - Atomic changes, easier review
4. **Link PRs to issues** - Always use "Closes #X" in PR body
5. **Write clear commit messages** - Explain what and why, not just what

## Examples from PayWall.xyz

### Real Examples
```bash
# Issue #6: "Setup TypeScript widget project"
# Branch: feat/widget-setup
# PR: "feat: setup TypeScript widget with build pipeline"

# Issue #11: "Setup Express server with PostgreSQL"
# Branch: feat/express-server
# PR: "feat: configure Express backend with PostgreSQL"

# Issue #14: "Create landing page with integration guide"
# Branch: docs/landing-page
# PR: "docs: create landing page and integration guide"
```

## Troubleshooting

### Branch name too long?
Script auto-truncates to 50 chars. If still too long, manually create:
```bash
git checkout -b feat/short-name
```

### Need to change PR title?
```bash
gh pr edit <number> --title "new: better title"
```

### Forgot to link issue?
Edit PR body to include `Closes #X`
