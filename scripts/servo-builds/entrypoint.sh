#!/bin/bash
set -euo pipefail

##############################################################
# Main Program                                               #
##############################################################       

# constants
GITHUB_DOMAIN="github.com"
GITHUB_OWNER="benjaminDanis"
GITHUB_REPO="test-app-gen"

# log the event payload
echo "PUSH EVENT | Payload JSON:"
echo "$EVENT_PAYLOAD" | jq '.'

# create the servo path
SERVO_PATH="/sources/$GITHUB_DOMAIN/$GITHUB_OWNER/$GITHUB_REPO/builds"
echo "SERVO PATH: $SERVO_PATH"

# get servo parameters

# get the commiit sha
COMMIT_SHA=$(echo "$EVENT_PAYLOAD" | jq -r '.head_commit.id')
echo "COMMIT SHA: $COMMIT_SHA"

# get branch
BRANCH=$(echo "$EVENT_PAYLOAD" | jq -r '.ref' | sed 's|refs/heads/||')
echo "BRANCH: $BRANCH"

# test curl servo request
SERVO_RESPONSE=$(curl --location "https://next.onservo.com/api/sources/$GITHUB_DOMAIN/$GITHUB_OWNER/$GITHUB_REPO/builds" \
  --method "POST" \
  --header "token: $SERVO_TOKEN" \
  --header "Content-Type: application/json" \
  --data-raw "{
    \"handle\": \"$COMMIT_SHA\"
  }" \
  --silent | jq '.')

echo "SERVO RESPONSE: $SERVO_RESPONSE"