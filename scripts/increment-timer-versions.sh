#!/bin/bash

# Script to auto-increment timer version numbers by 0.01
# This script finds timer HTML files and increments their version numbers
# When main.html or index.html are committed, it also increments the site version in version.json

# List of individual timer files to check
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
    "pyramid.html"
    "custom.html"
)

# Site-wide files that trigger version.json increment
SITE_FILES=(
    "main.html"
    "index.html"
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

# Function to increment site version in version.json
increment_site_version() {
    local version_file="public/version.json"
    
    if [ ! -f "$version_file" ]; then
        echo "version.json not found, skipping site version increment..."
        return
    fi
    
    # Check if version.json is staged or if we're doing a site-wide update
    if ! check_staged "$version_file"; then
        # If version.json isn't staged, we need to stage it after updating
        stage_version_json=true
    else
        stage_version_json=false
    fi
    
    # Read current version using Python or awk (more reliable than jq which might not be installed)
    if command -v python3 &> /dev/null; then
        current_version=$(python3 -c "import json; f=open('$version_file'); d=json.load(f); print(d.get('version', '1.0'))" 2>/dev/null)
    elif command -v python &> /dev/null; then
        current_version=$(python -c "import json; f=open('$version_file'); d=json.load(f); print(d.get('version', '1.0'))" 2>/dev/null)
    else
        # Fallback: use grep and awk
        current_version=$(grep -o '"version": "[^"]*"' "$version_file" | awk -F'"' '{print $4}')
    fi
    
    if [ -z "$current_version" ]; then
        echo "Could not read version from version.json, skipping..."
        return
    fi
    
    # Increment version by 0.01
    new_version=$(echo "$current_version" | awk '{printf "%.2f", $1 + 0.01}')
    
    # Get current date and time
    build_time=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
    build_date=$(date '+%B %d, %Y at %I:%M:%S %p')
    
    # Update version.json using Python (more reliable for JSON)
    if command -v python3 &> /dev/null; then
        python3 << EOF
import json
import sys

try:
    with open('$version_file', 'r') as f:
        data = json.load(f)
    
    data['version'] = '$new_version'
    data['buildTime'] = '$build_time'
    data['buildDate'] = '$build_date'
    
    with open('$version_file', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Updated $version_file: v$current_version -> v$new_version")
except Exception as e:
    print(f"Error updating version.json: {e}", file=sys.stderr)
    sys.exit(1)
EOF
    elif command -v python &> /dev/null; then
        python << EOF
import json
import sys

try:
    with open('$version_file', 'r') as f:
        data = json.load(f)
    
    data['version'] = '$new_version'
    data['buildTime'] = '$build_time'
    data['buildDate'] = '$build_date'
    
    with open('$version_file', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Updated $version_file: v$current_version -> v$new_version")
except Exception as e:
    print(f"Error updating version.json: {e}", file=sys.stderr)
    sys.exit(1)
EOF
    else
        echo "Python not found, cannot update version.json. Please install Python."
        return
    fi
    
    # Stage version.json if it wasn't already staged
    if [ "$stage_version_json" = true ]; then
        git add "$version_file"
    fi
}

# Main execution
echo "Checking timer files for version increments..."

# Check for site-wide files first
site_update=false
for file in "${SITE_FILES[@]}"; do
    if check_staged "$file"; then
        echo "Site file $file is staged, will increment site version..."
        site_update=true
    fi
done

# If site files are staged, increment site version
if [ "$site_update" = true ]; then
    increment_site_version
fi

# Check individual timer files
for file in "${TIMER_FILES[@]}"; do
    if check_staged "$file"; then
        echo "Timer file $file is staged, incrementing version..."
        increment_version "$file"
        # Re-stage the file after modification
        git add "$file"
    fi
done

echo "Version increment complete!"
