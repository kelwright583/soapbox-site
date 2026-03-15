# GitHub Integration Setup - Step by Step

## Quick Setup Guide

Follow these steps to enable automatic saving from the admin panel.

---

## Step 1: Create GitHub Repository

### Option A: Create New Repository (Recommended)

1. **Go to GitHub.com** and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. **Repository name:** `soapbox-site` (or any name you prefer)
4. **Description:** (optional) "In the Absence of a Soapbox website"
5. **Visibility:** 
   - Choose **Public** (free, anyone can see code)
   - Or **Private** (only you can see, requires GitHub Pro for free private repos with collaborators)
6. **DO NOT** check "Initialize with README" (we'll upload files separately)
7. Click **"Create repository"**

### Option B: Use Existing Repository

If you already have a repository, note down:
- Your GitHub username
- Repository name
- Format: `username/repository-name`

---

## Step 2: Upload Your Site Files

You need to upload your site files to GitHub first. Here are your options:

### Option A: Using GitHub Website (Easiest)

1. In your new repository, click **"uploading an existing file"**
2. Drag and drop all files from your `soapbox-pwa` folder
3. **Important:** Make sure to upload:
   - All HTML files
   - `css/` folder
   - `js/` folder
   - `data/` folder
   - `assets/` folder
   - `dispatches/` folder
   - `manifest.webmanifest`
   - `sw.js`
4. Scroll down, enter commit message: "Initial site upload"
5. Click **"Commit changes"**

### Option B: Using Git Command Line

If you have Git installed:

```bash
cd soapbox-pwa
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPO` with your actual values.

---

## Step 3: Create Personal Access Token

This token allows the admin panel to save files to GitHub.

1. **Go to GitHub.com** → Click your profile picture (top right) → **Settings**
2. Scroll down → **Developer settings** (left sidebar)
3. Click **"Personal access tokens"** → **"Tokens (classic)"**
4. Click **"Generate new token"** → **"Generate new token (classic)"**
5. **Note:** Give it a name like "Soapbox Admin Panel"
6. **Expiration:** Choose how long it should last (90 days, 1 year, or no expiration)
7. **Select scopes:** Check **`repo`** (this gives full control of repositories)
   - This will automatically check all repo sub-options
8. Scroll down → Click **"Generate token"**
9. **IMPORTANT:** Copy the token immediately! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again
   - Save it somewhere safe (password manager, notes app, etc.)

---

## Step 4: Configure in Admin Panel

1. **Open admin.html** in your browser
   - Local: `file:///path/to/admin.html` or `http://localhost:8000/admin.html`
2. **Enter password:** `soapbox2025` (or whatever you changed it to)
3. **Click "GitHub Setup" tab**
4. **Fill in the form:**
   - ✅ Check **"Enable GitHub Auto-Save"**
   - **GitHub Repository:** Enter `your-username/repository-name`
     - Example: `kelwyn/soapbox-site`
   - **Branch:** Enter `main` (or `master` if that's what your repo uses)
   - **Personal Access Token:** Paste the token you copied
5. **Click "Save GitHub Settings"**
6. You should see: "✓ GitHub auto-save enabled!"

---

## Step 5: Test It!

1. Go to **"Unsolicited Opinions"** tab
2. Make a small change (or add a test dispatch)
3. Click **"Save Dispatch"**
4. You should see: "✓ Saved successfully! Site will update automatically."

**Check GitHub:**
- Go to your repository on GitHub
- Click on `data/dispatches.json`
- You should see your changes!

---

## Step 6: Set Up Auto-Deployment (Optional but Recommended)

For the site to update automatically when you save, set up hosting:

### Netlify (Easiest)

1. Go to **netlify.com** and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"GitHub"** → Authorize Netlify
4. Select your repository
5. **Build settings:**
   - Build command: (leave empty - it's a static site)
   - Publish directory: `/` (root)
6. Click **"Deploy site"**
7. Your site will be live at: `your-site-name.netlify.app`

**Now:** Every time you save in admin → GitHub updates → Netlify auto-deploys!

### Vercel (Alternative)

1. Go to **vercel.com** and sign up/login
2. Click **"Add New Project"**
3. Import from GitHub → Select your repository
4. Click **"Deploy"**
5. Your site will be live!

---

## Troubleshooting

### "Failed to save to GitHub"

**Check:**
- ✅ Repository format is correct: `username/repo-name` (no spaces, lowercase)
- ✅ Token has `repo` permissions
- ✅ Branch name matches (usually `main` or `master`)
- ✅ Token hasn't expired
- ✅ Repository exists and you have access

**Test token:**
- Try accessing: `https://api.github.com/user` with your token
- Should return your user info

### "Repository not found"

- Make sure repository name is exact (case-sensitive)
- Format: `username/repository-name`
- Check you have access to the repository

### "Token invalid"

- Token might have expired
- Create a new token
- Make sure you copied the entire token (starts with `ghp_`)

### Content not updating on live site

- If using Netlify/Vercel: Check deployment logs
- Make sure files are being committed to GitHub
- Clear browser cache
- Check file paths are correct

---

## Security Notes

⚠️ **Important:**
- Token is stored in your browser's localStorage (local only)
- Never share your token publicly
- If token is compromised, revoke it immediately in GitHub settings
- Consider setting token expiration for security

**To revoke token:**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Find your token → Click "Revoke"

---

## What Happens When You Save

1. **You click "Save"** in admin panel
2. **Admin panel** creates/updates JSON files
3. **GitHub API** receives the files
4. **GitHub** commits the changes
5. **Netlify/Vercel** (if set up) detects the change
6. **Site auto-deploys** with new content
7. **Done!** No manual uploads needed

---

## Next Steps

Once set up:
- ✅ Edit content in admin
- ✅ Click save
- ✅ Site updates automatically
- ✅ No code editing ever needed!

**Questions?** Check browser console (F12) for error messages if something doesn't work.




