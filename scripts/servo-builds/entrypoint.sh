#!/bin/bash
set -euo pipefail

SERVO_API_BASE_URL="https://next.onservo.com/api"
SEVEN_DAYS_IN_SECONDS=$((7 * 24 * 60 * 60))

check_token_validity()
{
  # check if token is expired.
  # if it is, emit a clear error message and exit.
  local servo_api_request_path="/tokens/$SERVO_TOKEN_HANDLE"
  local servo_api_request_url="${SERVO_API_BASE_URL}${servo_api_request_path}"

  local http_response=$(curl --write-out "HTTPSTATUS:%{http_code}" \
    --silent --show-error --request "GET" \
    --location "$servo_api_request_url" \
    --header "token: $SERVO_TOKEN" \
  )

  local http_status=$(echo "$http_response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
  local http_body=$(echo "$http_response" | sed -e 's/HTTPSTATUS\:.*//g')

  # Parse expiration timestamp (in milliseconds)
  local expires_at_ms=$(echo "$http_body" | jq -r '.expiresAt')
  local expires_at_s=$((expires_at_ms / 1000))

  local now=$(date +%s)

  # Set buffer window (e.g., 7 days = 604800 seconds)
  local buffer_seconds_str=${SERVO_TOKEN_EXPIRY_BUFFER_SECONDS:-$SEVEN_DAYS_IN_SECONDS}
  # Ensure buffer_seconds is an integer
  buffer_seconds=$((buffer_seconds_str))

  # Compute time until expiry
  time_left=$((expires_at_s - now))
  time_left_days=$((time_left / (24 * 60 * 60)))

  echo "Token expires in $time_left_days days."

  if (( time_left <= 0 )); then
    echo "❌ Token is expired."
    return 1
  elif (( time_left <= buffer_seconds )); then
    echo "⚠️  Token is expiring soon. Please rotate the token in order to avoid service disruption."
    # TODO: send a slack message if possible (phase II)
    return 2
  else
    echo "✅ Token is valid."
    return 0
  fi

}

trigger_build()
{
  # get domain, owner, + repo for Servo API request URL
  local github_domain=${GITHUB_DOMAIN_URL#https://}
  local github_owner github_repo
  IFS='/' read -r github_owner github_repo <<< "$GITHUB_REPOSITORY"

  echo "::group::Repo Information"
  echo "GitHub Domain: $github_domain"
  echo "GitHub Owner: $github_owner"
  echo "GitHub Repo: $github_repo"
  echo "::endgroup::"

  # get commit sha + branch for Servo API request payload
  local commit_sha=$(echo "$EVENT_PAYLOAD" | jq -r '.head_commit.id')
  local branch=$(echo "$EVENT_PAYLOAD" | jq -r '.ref' | sed 's|refs/heads/||')
  echo "::group::Commit Info"
  echo "Build SHA: $commit_sha"
  echo "Branch: $branch"
  echo "::endgroup::"

    local payload=$(cat <<EOF
{
  "handle": "$commit_sha"
}
EOF
)

  echo "::group::Payload"
  echo "Create request payload: $payload"
  echo "::endgroup::"

  # create request URL for Servo API request
  local servo_api_request_path="/sources/$github_domain/$github_owner/$github_repo/builds"
  local servo_api_request_url="${SERVO_API_BASE_URL}${servo_api_request_path}"
  echo "::group::Sending build request to Servo API"
  echo "URL: $servo_api_request_url"
  echo "::endgroup::"

  # make the Servo API request for creating a build
  local http_response=$(curl --write-out "HTTPSTATUS:%{http_code}" \
    --silent --show-error --request "POST" \
    --location "$servo_api_request_url" \
    --header "token: $SERVO_TOKEN" \
    --header "Content-Type: application/json" \
    --data "$payload"
  )

  # response data
  local http_status=$(echo "$http_response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
  local http_body=$(echo "$http_response" | sed -e 's/HTTPSTATUS\:.*//g')

  local servo_response_body=$(echo "$http_body" | jq '.')
  local servo_response_commit_sha=$(echo "$servo_response_body" | jq -r '.commit.sha')
  local servo_response_commit_message=$(echo "$servo_response_body" | jq -r '.commit.message')
  local servo_response_commit_author=$(echo "$servo_response_body" | jq -r '.commit.author')
  local servo_response_build_status=$(echo "$servo_response_body" | jq -r '.status')

  # Log and exit based on status
  # validate response
  if [[ "$http_status" -ge 200 && "$http_status" -lt 300 ]]; then
    echo "::group::Servo Build Created Successfully"
    echo "HTTP $http_status"
    echo "commit: $servo_response_commit_sha"
    echo "message: $servo_response_commit_message"
    echo "author: $servo_response_commit_author"
    echo "build status: $servo_response_build_status"
    echo "::endgroup::"

    echo "::group::Servo Response Summary"
    echo "NOTE: Build info is shared by repo, not app."
    echo "Visit: https://next.onservo.com/orgs/<ORG>/regions/<REGION>/apps/<APP>/builds"
    echo "::endgroup::"
  else
    echo "::group::Servo Build Failed"
    echo "HTTP $http_status"
    echo "$http_body" | jq '.' || echo "$http_body"
    echo "::endgroup::"
    exit 1
  fi
}

if ! check_token_validity; then
  echo "Rotate the Servo token in order to continue automated builds."
  exit 1
fi

trigger_build