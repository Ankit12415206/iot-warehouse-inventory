#!/usr/bin/env bash
TS=$(date +"%Y%m%d_%H%M")
mkdir -p "$(dirname "$0")/../backups"
cp "$(dirname "$0")/../data/app.db" "$(dirname "$0")/../backups/app.db.$TS"
echo "Backup saved"
