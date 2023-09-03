#!/bin/bash

plaintext="$1"

pubkey_file="public_key.pem"

encrypted=$(echo -n "$plaintext" | openssl rsautl -encrypt -pubin -inkey "$pubkey_file" | base64)

echo "encrypted_result: $encrypted"

