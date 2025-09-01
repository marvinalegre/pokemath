#!/bin/bash

# Target URL of your Express app
URL="http://localhost:3000/signup"

# Number of requests to send
TOTAL_REQUESTS=20

# Delay between requests (in seconds). Set to 0 for full speed.
DELAY=0.1

# User-Agent to simulate the same client
USER_AGENT="TrafficSimulator/1.0"

echo "Starting traffic simulation to $URL"
for i in $(seq 1 $TOTAL_REQUESTS)
do
  echo "[$i/$TOTAL_REQUESTS] Sending request..."
  curl -s -o /dev/null -w "%{http_code}\n" -A "$USER_AGENT" "$URL"
  sleep $DELAY
done

echo "Traffic simulation completed."
