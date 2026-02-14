#!/bin/bash
set -e

echo "Creating Milestone 1: Smart Contract Foundation..."
gh api repos/:owner/:repo/milestones -f title="Milestone 1: Smart Contract" -f description="Smart contract implementation" > /dev/null

M1=$(gh api repos/:owner/:repo/milestones --jq '.[] | select(.title=="Milestone 1: Smart Contract") | .number')

gh issue create --title "Setup Clarinet project and contract skeleton" \
  --body "Initialize Clarinet project with basic contract structure and configuration files." \
  --milestone "$M1" --label "contract"

gh issue create --title "Implement unlock-content function" \
  --body "Create public function for STX transfer and access granting with 90/10 revenue split." \
  --milestone "$M1" --label "contract"

gh issue create --title "Implement has-access read-only function" \
  --body "Create read-only function to check if user has unlocked specific content." \
  --milestone "$M1" --label "contract"

gh issue create --title "Implement register-content function" \
  --body "Allow content creators to register content IDs with pricing." \
  --milestone "$M1" --label "contract"

gh issue create --title "Write contract tests" \
  --body "Comprehensive test suite covering all functions and error cases." \
  --milestone "$M1" --label "test"

echo "Creating Milestone 2: Widget Core..."
gh api repos/:owner/:repo/milestones -f title="Milestone 2: Widget Core" -f description="JavaScript widget implementation" > /dev/null

M2=$(gh api repos/:owner/:repo/milestones --jq '.[] | select(.title=="Milestone 2: Widget Core") | .number')

gh issue create --title "Setup TypeScript widget project" \
  --body "Initialize widget with TypeScript, Rollup build pipeline, and dependencies." \
  --milestone "$M2" --label "widget"

gh issue create --title "Implement wallet connection" \
  --body "Integrate @stacks/connect for wallet authentication." \
  --milestone "$M2" --label "widget"

gh issue create --title "Implement payment transaction flow" \
  --body "Create contract-call transactions using @stacks/transactions." \
  --milestone "$M2" --label "widget"

gh issue create --title "Implement transaction verification" \
  --body "Poll Stacks API to verify transaction success." \
  --milestone "$M2" --label "widget"

gh issue create --title "Add content blur/unlock UI" \
  --body "DOM manipulation for content locking and unlock button rendering." \
  --milestone "$M2" --label "widget"

echo "Creating Milestone 3: Backend API..."
gh api repos/:owner/:repo/milestones -f title="Milestone 3: Backend API" -f description="Express API server" > /dev/null

M3=$(gh api repos/:owner/:repo/milestones --jq '.[] | select(.title=="Milestone 3: Backend API") | .number')

gh issue create --title "Setup Express server with PostgreSQL" \
  --body "Initialize Express app with database connection and middleware." \
  --milestone "$M3" --label "backend"

gh issue create --title "Implement verification endpoint" \
  --body "POST /api/verify/transaction endpoint for transaction validation." \
  --milestone "$M3" --label "backend"

gh issue create --title "Implement analytics endpoint" \
  --body "GET /api/analytics/creator/:address for revenue tracking." \
  --milestone "$M3" --label "backend"

echo "Creating Milestone 4: Documentation & Demo..."
gh api repos/:owner/:repo/milestones -f title="Milestone 4: Docs & Demo" -f description="Landing page and demo" > /dev/null

M4=$(gh api repos/:owner/:repo/milestones --jq '.[] | select(.title=="Milestone 4: Docs & Demo") | .number')

gh issue create --title "Create landing page" \
  --body "Build landing/index.html with feature showcase and integration guide." \
  --milestone "$M4" --label "docs"

gh issue create --title "Build demo blog" \
  --body "Working demo in demo/index.html with paywalled content." \
  --milestone "$M4" --label "docs"

gh issue create --title "Write documentation" \
  --body "Complete README and API documentation in landing/docs.html." \
  --milestone "$M4" --label "docs"

gh issue create --title "Deploy and create demo video" \
  --body "Deploy to testnet, record demo video, finalize deliverables." \
  --milestone "$M4" --label "deployment"

echo "All issues created successfully!"
