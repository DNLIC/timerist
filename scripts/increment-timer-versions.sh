#!/bin/bash

# Script to auto-increment timer version numbers by 0.01
# This script finds timer HTML files and increments their version numbers

# List of timer files to check
TIMER_FILES=(
    "stopwatch.html"
    "stopwatch-splits.html"
    "interval.html"
    "quick-interval.html"
    "quick-countdown.html"
    "countdown.html"
    "tabata.html"
    "hiit.html"
    "emom.html"
    "amrap.html"
    "pomodoro.html"
    "pyramid.html"
    "custom.html"
)

# Function to increment version
increment_version() {
    local file=$1
    if [ ! -f "$file" ]; then
        return
    fi
    
    # Extract current version using sed (more compatible than grep -P)
    version_line=$(grep '<p><strong>Version:</strong>' "$file" | head -1)
    
    if [ -z "$version_line" ]; then
        echo "No version found in $file, skipping..."
        return
    fi
    
    # Extract version number (handles formats like v0.1, v1.0, v1.23, etc.)
    # Pattern: <p><strong>Version:</strong> v0.1</p>
    # Use awk to extract the version number after "v"
    current_version=$(echo "$version_line" | awk -F'v' '{print $2}' | awk -F'<' '{print $1}')
    
    if [ -z "$current_version" ] || [ "$current_version" = "$version_line" ]; then
        echo "Could not parse version in $file, skipping..."
        return
    fi
    
    # Increment version by 0.01 using awk
    new_version=$(echo "$current_version" | awk '{printf "%.2f", $1 + 0.01}')
    
    # Update the file - replace the version number while preserving whitespace
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - use extended regex
        sed -i '' -E "s/(<p><strong>Version:<\/strong> )v[0-9]+\.[0-9]+/\1v$new_version/g" "$file"
    else
        # Linux
        sed -i -E "s/(<p><strong>Version:<\/strong> )v[0-9]+\.[0-9]+/\1v$new_version/g" "$file"
    fi
    
    echo "Updated $file: v$current_version -> v$new_version"
}

# Check if files are staged for commit
check_staged() {
    local file=$1
    git diff --cached --name-only | grep -q "^$file$"
}

# Main execution
echo "Checking timer files for version increments..."

for file in "${TIMER_FILES[@]}"; do
    if check_staged "$file"; then
        echo "File $file is staged, incrementing version..."
        increment_version "$file"
        # Re-stage the file after modification
        git add "$file"
    fi
done

echo "Version increment complete!"
