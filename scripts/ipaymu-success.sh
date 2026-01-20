#!/bin/bash

# Configuration
# Usage: ./scripts/ipaymu-success.sh [REFERENCE_ID] [PORT]
# Example: ./scripts/ipaymu-success.sh 73F2euRiU59yRHaVtm8P 3007

REFERENCE_ID=${1:-"019bdc7d-3174-73d8-9f5f-3eb34c8662a0"}
PORT=${2:-3007}

# iPaymu Webhook Fields
# - status_code: "1" for success, "0" for pending, "-1" for failed
TRX_ID="TRX-$(date +%s)"
STATUS="berhasil"
STATUS_CODE="1" 
SID="SID-$(date +%s)"

echo "------------------------------------------------"
echo "Emulating iPaymu SUCCESS Webhook"
echo "Reference ID: $REFERENCE_ID"
echo "Target Port:  $PORT"
echo "------------------------------------------------"

curl -X POST "http://localhost:$PORT/api/webhook/payment?provider=ipaymu" \
  -H "Content-Type: application/json" \
  -d "{
    \"trx_id\": \"$TRX_ID\",
    \"status\": \"$STATUS\",
    \"status_code\": \"$STATUS_CODE\",
    \"sid\": \"$SID\",
    \"reference_id\": \"$REFERENCE_ID\"
  }"

echo -e "\n\n------------------------------------------------"
echo "Webhook sent to http://localhost:$PORT/api/webhook/payment"
echo "Check background worker logs for processing status."
echo "------------------------------------------------"
