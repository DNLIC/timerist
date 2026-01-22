# Auto-Increment Timer Versions

This repository includes an automatic version increment system for timer HTML files.

## How It Works

When you commit timer files to git, the version numbers are automatically incremented by 0.01 before the commit is finalized.

## Setup

The git pre-commit hook is already set up in `.git/hooks/pre-commit`. If you're cloning this repository on a new machine, you'll need to set up the hook:

```bash
# Make sure the hook is executable
chmod +x .git/hooks/pre-commit

# Make sure the script is executable
chmod +x scripts/increment-timer-versions.sh
```

## Supported Files

### Individual Timer Files
The following timer files are automatically versioned when THEY are committed:
- stopwatch.html
- stopwatch-splits.html
- interval.html
- quick-interval.html
- quick-countdown.html
- countdown.html
- tabata.html
- hiit.html
- emom.html
- amrap.html
- pyramid.html
- custom.html

### Site-Wide Version
When `main.html` or `index.html` are committed (indicating a site-wide deployment), the site version in `public/version.json` is also incremented by 0.01. This version is displayed on the main index page.

## How It Works

### Individual Timer Files
1. When you stage a timer file for commit (`git add stopwatch.html`)
2. The pre-commit hook runs automatically
3. It checks which timer files are staged
4. For each staged timer file, it:
   - Extracts the current version (e.g., v0.1)
   - Increments it by 0.01 (e.g., v0.11)
   - Updates the file
   - Re-stages the updated file
5. The commit proceeds with the incremented version numbers

### Site-Wide Deployment
1. When you stage `main.html` or `index.html` for commit
2. The script detects this as a site-wide update
3. It increments the version in `public/version.json` by 0.01
4. Updates the build date and time
5. Re-stages the updated `version.json` file
6. Individual timer files can still be incremented in the same commit if they're also staged

## Manual Usage

You can also run the script manually:

```bash
./scripts/increment-timer-versions.sh
```

Note: The script only increments versions for files that are currently staged for commit.

## Version Format

Versions must be in the format: `vX.XX` (e.g., v0.1, v1.23, v2.50)

The version is located in the HTML file at:
```html
<p><strong>Version:</strong> v0.1</p>
```
