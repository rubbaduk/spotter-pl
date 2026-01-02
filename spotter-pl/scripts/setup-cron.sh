#!/bin/bash

# Setup cron job to run database update weekly
# Run this script once to set up the cron job

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Create cron job entry
CRON_JOB="0 2 * * 0 cd $PROJECT_DIR && bash $SCRIPT_DIR/update-database.sh >> $PROJECT_DIR/cron.log 2>&1"

# Check if cron job already exists
(crontab -l 2>/dev/null | grep -F "$SCRIPT_DIR/update-database.sh") && {
    echo "Cron job already exists"
    exit 0
}

# Add cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "Cron job added successfully!"
echo "Database will update every Sunday at 2:00 AM"
echo "Logs will be written to: $PROJECT_DIR/cron.log"
