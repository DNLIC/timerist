# Firebase Automatic Deployment Setup

## Current Status

✅ **GitHub Repository**: Linked to `https://github.com/DNLIC/timerist`  
✅ **Firebase Project**: `timerist-4ecd9` (alias: `ttimer`)  
✅ **GitHub Actions Workflow**: Created at `.github/workflows/firebase-deploy.yml`  
⚠️ **Automatic Deployment**: Needs Firebase Service Account setup

## To Enable Automatic Deployment

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

## Manual Deployment (Alternative)

If you prefer manual deployment, you can always run:

```bash
firebase deploy --only hosting
```

This will deploy directly from your local machine.

## Current Deployment Status

- **Automatic**: ❌ Not yet configured (needs service account)
- **Manual**: ✅ Ready (run `firebase deploy --only hosting`)

