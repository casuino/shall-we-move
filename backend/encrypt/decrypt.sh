#!/bin/bash

encrypted="$1"

privkey_file="private_key.pem"

decrypted=$(echo -n "$encrypted" | base64 -d | openssl rsautl -decrypt -inkey "$privkey_file")

echo "decrypted_result: $decrypted"

