#!/bin/bash

# Run this script once to set up the launch agent

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLIST_NAME="com.spotterpl.update-database.plist"
PLIST_SOURCE="$SCRIPT_DIR/$PLIST_NAME"
PLIST_DEST="$HOME/Library/LaunchAgents/$PLIST_NAME"

# if plist exists
if [ ! -f "$PLIST_SOURCE" ]; then
    echo "Error: $PLIST_SOURCE not found"
    exit 1
fi

# create LaunchAgents directory if it doesn't exist
mkdir -p "$HOME/Library/LaunchAgents"

# unload existing job if present
launchctl unload "$PLIST_DEST" 2>/dev/null

# copy plist to LaunchAgents
cp "$PLIST_SOURCE" "$PLIST_DEST"

# load the job
launchctl load "$PLIST_DEST"

echo "Launch agent installed successfully"
echo "Database will update every Sunday at 2:00 AM"
echo "Logs will be written to:"
echo "  - launchd.log (stdout)"
echo "  - launchd-error.log (stderr)"
echo ""
echo "To manually trigger the job now, run:"
echo "  launchctl start com.spotterpl.update-database"
echo ""
echo "To uninstall, run:"
echo "  launchctl unload ~/Library/LaunchAgents/$PLIST_NAME"
echo "  rm ~/Library/LaunchAgents/$PLIST_NAME"
