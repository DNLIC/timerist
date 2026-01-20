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

## Supported Timer Files

The following timer files are automatically versioned:
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
- pomodoro.html
- pyramid.html
- custom.html

## How It Works

1. When you stage timer files for commit (`git add`)
2. The pre-commit hook runs automatically
3. It checks which timer files are staged
4. For each staged timer file, it:
   - Extracts the current version (e.g., v0.1)
   - Increments it by 0.01 (e.g., v0.11)
   - Updates the file
   - Re-stages the updated file
5. The commit proceeds with the incremented version numbers

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
