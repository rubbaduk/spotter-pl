#!/bin/bash

# Database update script
# Runs all database population scripts in sequence

set -e  # Exit on error

echo "Starting database update..."
echo "$(date): Database update started" >> update.log

# Setup schema
echo "Setting up schema..."
npm run setup-schema

# Download latest data
echo "Downloading data..."
npm run download-data

# Import data
echo "Importing data..."
npm run import-data

# Populate lifter search
echo "Populating lifter search..."
npm run populate-lifter-search

echo "Database update completed successfully!"
echo "$(date): Database update completed" >> update.log
