#!/bin/bash

# Script to push Timerist to GitHub
# Make sure you've created the repository on GitHub first!

echo "🚀 Pushing Timerist to GitHub..."
echo ""

# Check if remote is already set
if git remote get-url origin > /dev/null 2>&1; then
    echo "Remote 'origin' already exists. Updating..."
    read -p "Enter your GitHub username: " username
    git remote set-url origin https://github.com/$username/timerist.git
else
    read -p "Enter your GitHub username: " username
    git remote add origin https://github.com/$username/timerist.git
fi

echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your repository should be available at:"
echo "   https://github.com/$username/timerist"

