#!/bin/bash

# Configuration
# Usage: ./scripts/ipaymu-success.sh [REFERENCE_ID] [PORT]
# Example: ./scripts/ipaymu-success.sh 73F2euRiU59yRHaVtm8P 3007

REFERENCE_ID=${1:-"019bdc7d-3174-73d8-9f5f-3eb34c8662a0"}
PORT=${2:-3007}

# iPaymu Webhook Fields
# - status_code: "1" for success, "0" for pending, "-1" for failed
TRX_ID="$(date +%s)"
STATUS="berhasil"
STATUS_CODE="1" 
SID="9fdfe661-0000-41d9-ba0f-639d8bffaa69"

echo "------------------------------------------------"
echo "Emulating iPaymu SUCCESS Webhook"
echo "Reference ID: $REFERENCE_ID"
echo "Target Port:  $PORT"
echo "------------------------------------------------"

curl -X POST "http://localhost:$PORT/api/webhook/payment?provider=ipaymu" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-External-ID: $(date +%s)" \
  -H "X-Signature: test-signature" \
  -H "X-Timestamp: $(date -u +%Y-%m-%dT%H:%M:%S%z)" \
  -d "trx_id=$TRX_ID&status=$STATUS&status_code=$STATUS_CODE&sid=$SID&reference_id=$REFERENCE_ID&sub_total=10000&total=11000&amount=11000&fee=1000&paid_off=11000&created_at=$(date +%Y-%m-%d\ %H:%M:%S)&expired_at=$(date -d '+1 day' +%Y-%m-%d\ %H:%M:%S)&paid_at=$(date +%Y-%m-%d\ %H:%M:%S)&settlement_status=settled&transaction_status_code=1&is_escrow=false&via=qris&channel=mpm&buyer_name=Test&buyer_email=test@example.com&buyer_phone=081234567890&additional_info=[]"

echo -e "\n\n------------------------------------------------"
echo "Webhook sent to http://localhost:$PORT/api/webhook/payment"
echo "Check background worker logs for processing status."
echo "------------------------------------------------"
