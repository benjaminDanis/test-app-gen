#!/bin/bash
set -euo pipefail

##############################################################
# Main Program                                               #
##############################################################       

# get domain, owner, + repo for Servo API request URL
GITHUB_DOMAIN=${GITHUB_DOMAIN_URL#https://}
IFS='/' read -r GITHUB_OWNER GITHUB_REPO <<< "$GITHUB_REPOSITORY"

echo "::group::Repo Information"
echo "GitHub Domain: $GITHUB_DOMAIN"
echo "GitHub Owner: $GITHUB_OWNER"
echo "GitHub Repo: $GITHUB_REPO"
echo "::endgroup::"

# get commit sha + branch for Servo API request payload
COMMIT_SHA=$(echo "$EVENT_PAYLOAD" | jq -r '.head_commit.id')
BRANCH=$(echo "$EVENT_PAYLOAD" | jq -r '.ref' | sed 's|refs/heads/||')
echo "::group::Commit Info"
echo "Build SHA: $COMMIT_SHA"
echo "Branch: $BRANCH"
echo "::endgroup::"

PAYLOAD=$(cat <<EOF
{
  "handle": "$COMMIT_SHA"
}
EOF
)
echo "::group::Payload"
echo "Create request payload: $PAYLOAD"
echo "::endgroup::"

# create request URL for Servo API request
SERVO_API_BASE_URL="https://next.onservo.com/api"
SERVO_API_REQUEST_PATH="/sources/$GITHUB_DOMAIN/$GITHUB_OWNER/$GITHUB_REPO/builds"
SERVO_API_REQUEST_URL="${SERVO_API_BASE_URL}${SERVO_API_REQUEST_PATH}"
echo "::group::Sending build request to Servo API"
echo "URL: $SERVO_API_REQUEST_URL"
echo "::endgroup::"

# make the Servo API request for creating a build
HTTP_RESPONSE=$(curl --write-out "HTTPSTATUS:%{http_code}" \
  --silent --show-error --request "$METHOD" \
  --location "$SERVO_API_REQUEST_URL" \
  --header "token: $SERVO_TOKEN" \
  --header "Content-Type: application/json" \
  --data "$PAYLOAD")

# response data
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed -e 's/HTTPSTATUS\:.*//g')

SERVO_RESPONSE_BODY=$(echo "$HTTP_BODY" | jq '.')
SERVO_RESPONSE_COMMIT_SHA=$(echo "$SERVO_RESPONSE_BODY" | jq -r '.commit.sha')
SERVO_RESPONSE_COMMIT_MESSAGE=$(echo "$SERVO_RESPONSE_BODY" | jq -r '.commit.message')
SERVO_RESPONSE_COMMIT_AUTHOR=$(echo "$SERVO_RESPONSE_BODY" | jq -r '.commit.author')
SERVO_RESPONSE_BUILD_STATUS=$(echo "$SERVO_RESPONSE_BODY" | jq -r '.status')

# Log and exit based on status
# validate response
if [[ "$HTTP_STATUS" -ge 200 && "$HTTP_STATUS" -lt 300 ]]; then
  echo "::group::Servo Build Created Successfully"
  echo "HTTP $HTTP_STATUS"
  echo "commit: $SERVO_RESPONSE_COMMIT_SHA"
  echo "message: $SERVO_RESPONSE_COMMIT_MESSAGE"
  echo "author: $SERVO_RESPONSE_COMMIT_AUTHOR"
  echo "build status: $SERVO_RESPONSE_BUILD_STATUS"
  echo "::endgroup::"

  echo "::group::Servo Response Summary"
  echo "NOTE: Build info is shared by repo, not app."
  echo "Visit: https://next.onservo.com/orgs/<ORG>/regions/<REGION>/apps/<APP>/builds"
  echo "::endgroup::"
else
  echo "::group::Servo Build Failed"
  echo "HTTP $HTTP_STATUS"
  echo "$HTTP_BODY" | jq '.' || echo "$HTTP_BODY"
  echo "::endgroup::"
  exit 1
fi
