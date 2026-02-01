#!/bin/bash
# Push to GitHub and deploy to Firebase
# Run this in your terminal (needs GitHub + Firebase auth).

set -e
cd "$(dirname "$0")"

echo "📤 Pushing to GitHub..."
git push origin main
echo "✅ GitHub push done."
echo ""

echo "🔥 Deploying to Firebase (export + deploy)..."
npm run deploy
echo "✅ Firebase deploy done."
echo ""
echo "Repo:  https://github.com/DNLIC/timerist"
echo "Site:  https://timerist-4ecd9.web.app (or your Firebase Hosting URL)"
