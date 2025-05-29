#!/bin/bash
set -euo pipefail

##############################################################
# Main Program                                               #
##############################################################       

GITHUB_DOMAIN=${GITHUB_DOMAIN_URL#https://}
IFS='/' read -r GITHUB_OWNER GITHUB_REPO <<< "$GITHUB_REPOSITORY"

echo "GitHub Domain: $GITHUB_DOMAIN"
echo "GitHub Owner: $GITHUB_OWNER"
echo "GitHub Repo: $GITHUB_REPO"

# create the servo path
SERVO_API_BASE_URL="https://next.onservo.com/api"
SERVO_API_REQUEST_PATH="/sources/$GITHUB_DOMAIN/$GITHUB_OWNER/$GITHUB_REPO/builds"
$SERVO_API_REQUEST_URL="${SERVO_API_BASE_URL}${SERVO_API_REQUEST_PATH}"
echo "Servo API Request Path: $SERVO_API_REQUEST_PATH"

echo "=========================="
echo $EVENT_PAYLOAD
echo "=========================="



# get the commiit sha + branch
# COMMIT_SHA=$(echo "$EVENT_PAYLOAD" | jq -r '.head_commit.id')
# BRANCH=$(echo "$EVENT_PAYLOAD" | jq -r '.ref' | sed 's|refs/heads/||')

# echo "Building SHA $COMMIT_SHA from branch $BRANCH"

# PAYLOAD=$(cat <<EOF
# {
#   "handle": "$COMMIT_SHA"
# }
# EOF
# )

# echo "Create request payload: $PAYLOAD"

# # get builds to test URL
# echo "Sending build request to Servo API: $SERVO_API_REQUEST_URL"
# HTTP_RESPONSE=$(curl --write-out "HTTPSTATUS:%{http_code}" \
#   --silent --show-error --request "$METHOD" \
#   --location "$SERVO_API_REQUEST_URL" \
#   --header "token: $SERVO_TOKEN" \
#   --header "Content-Type: application/json" \
#   --data "$PAYLOAD")

# # response data
# HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
# HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed -e 's/HTTPSTATUS\:.*//g')

# SERVO_RESPONSE_BODY=$(echo "$HTTP_BODY" | jq '.')
# SERVO_RESPONSE_COMMIT_SHA=$(echo "$SERVO_RESPONSE" | jq -r '.commit.sha')
# SERVO_RESPONSE_COMMIT_MESSAGE=$(echo "$SERVO_RESPONSE" | jq -r '.commit.message')
# SERVO_RESPONSE_COMMIT_AUTHOR=$(echo "$SERVO_RESPONSE" | jq -r '.commit.author')
# SERVO_RESPONSE_STATUS=$(echo "$SERVO_RESPONSE" | jq -r '.status')

# # Log and exit based on status
# echo "$METHOD /api/sources/$GITHUB_DOMAIN/$GITHUB_OWNER/$GITHUB_REPO/builds status: $HTTP_STATUS"
