# Firebase Deployment Setup

## Deploy from Cursor (recommended)

**The connection between GitHub and Firebase is not used.** Deploy directly from the project:

```bash
npm run deploy
```

Run this in Cursor’s terminal (or your local terminal). It builds the app and deploys to Firebase Hosting. Live site: **https://timerist-4ecd9.web.app**

---

## Current Status

✅ **Firebase Project**: `timerist-4ecd9` (alias: `ttimer`)  
✅ **Direct deploy**: Use `npm run deploy` from the project  
✅ **GitHub Repository**: `https://github.com/DNLIC/timerist` (for code only)  
❌ **GitHub → Firebase auto-deploy**: Not connected (workflow exists but needs service account; optional)

## Optional: Enable GitHub → Firebase Auto-Deploy

Currently, **pushing to GitHub does NOT automatically deploy to Firebase**. You need to set up a Firebase Service Account for GitHub Actions.

### Step 1: Get Firebase Service Account Token

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **timerist-4ecd9**
3. Click the gear icon ⚙️ → **Project settings**
4. Go to the **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (this is your service account credentials)

### Step 2: Add Secret to GitHub

1. Go to your GitHub repository: `https://github.com/DNLIC/timerist`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Paste the **entire contents** of the JSON file you downloaded
6. Click **Add secret**

### Step 3: Test the Deployment

After adding the secret, any push to the `main` branch will automatically:
1. Trigger the GitHub Action
2. Deploy your site to Firebase Hosting
3. Make it live at your Firebase URL

## Manual Deployment (Deploy the same as Cursor / Out folder)

**Always use this command** so Firebase gets the correct built files (same as the `out` folder Cursor uses):

```bash
npm run deploy
```

Or explicitly:

```bash
npm run deploy:firebase
```

Both commands will:
1. Build the app and populate the `out` folder (Next.js export + HTML timers)
2. Deploy **only** that `out` folder to Firebase

**Do not run `firebase deploy --only hosting` by itself.** That deploys whatever is currently in `out`, which may be old or wrong. Always run `npm run deploy` (or `npm run deploy:firebase`) so the correct files are built first.

## Current Deployment Status

- **Direct from project**: ✅ Use `npm run deploy` from Cursor or terminal
- **GitHub → Firebase**: ❌ Not connected (optional; see “Optional: Enable GitHub → Firebase” above)

