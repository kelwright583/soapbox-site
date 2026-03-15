# Complete Admin System Guide

## Overview

The admin panel (`admin.html`) is now the **ONLY** place you need to manage all site content. No code editing required!

## What You Can Manage

### 1. **Unsolicited Opinions** (Dispatches)
- Add/edit/delete dispatches
- Set featured status (for carousel)
- Add quotes, reflections, tags
- All content appears automatically on site

### 2. **Book Information**
- Book title and subtitle
- Book description (multiple paragraphs)
- Excerpt content
- Purchase links (Amazon, Takealot, Kindle)

### 3. **About Page**
- Author bio (multiple paragraphs)
- House rules
- "Before You Read" section

### 4. **Home Page**
- "What This Is" section content

### 5. **Site Settings**
- Site title and subtitle
- Author name (used in carousel cards)
- Contact email
- Site domain

### 6. **GitHub Auto-Save** (Optional)
- Configure automatic saving to GitHub
- Changes deploy automatically
- No manual uploads needed

---

## How to Use

### Basic Workflow (Without GitHub)

1. **Open Admin:** Go to `admin.html` (password: `soapbox2025`)
2. **Edit Content:** Use the tabs to navigate different sections
3. **Save:** Click "Save" button
4. **Download:** JSON files download automatically
5. **Upload:** Upload the JSON files to your server at:
   - `data/dispatches.json`
   - `data/site-content.json`
6. **Done!** Site updates immediately

### With GitHub Auto-Save (Recommended)

1. **Set Up GitHub:**
   - Create a GitHub repository
   - Create a Personal Access Token (with `repo` permissions)
   - Go to "GitHub Setup" tab in admin
   - Enter repository name (format: `username/repo-name`)
   - Enter your token
   - Enable auto-save

2. **Use Admin:**
   - Edit any content
   - Click "Save"
   - Changes automatically save to GitHub
   - If using Netlify/Vercel, site auto-deploys!

---

## Admin Interface

### Tabs
- **Unsolicited Opinions** - Manage all dispatches
- **Book Information** - Book details and purchase links
- **About Page** - Author bio and house rules
- **Home Page** - "What This Is" content
- **Site Settings** - Site-wide settings
- **GitHub Setup** - Configure auto-save

### Adding Content

**For Dispatches:**
1. Fill out the form
2. Add tags (up to 3)
3. Check "Featured" if you want it in carousel
4. Click "Save Dispatch"

**For Paragraphs/Arrays:**
- Click "+ Add Paragraph" or "+ Add Rule"
- Type your content
- Remove items with the × button
- Order matters (top to bottom)

---

## GitHub Setup (Step-by-Step)

### Step 1: Create GitHub Repository

1. Go to GitHub.com
2. Click "New repository"
3. Name it (e.g., `soapbox-site`)
4. Make it public or private (your choice)
5. Don't initialize with README
6. Click "Create repository"

### Step 2: Upload Your Site

1. Upload all your site files to the repository
2. Commit and push

### Step 3: Create Personal Access Token

1. GitHub.com → Your profile → Settings
2. Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Name it (e.g., "Soapbox Admin")
5. Select scope: **`repo`** (full control of private repositories)
6. Generate token
7. **Copy the token immediately** (you won't see it again!)

### Step 4: Configure in Admin

1. Open `admin.html`
2. Go to "GitHub Setup" tab
3. Check "Enable GitHub Auto-Save"
4. Enter repository: `your-username/your-repo-name`
5. Enter branch: `main` (or `master`)
6. Paste your token
7. Click "Save GitHub Settings"

### Step 5: Deploy (Optional but Recommended)

**Netlify:**
1. Go to netlify.com
2. "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Deploy!

**Vercel:**
1. Go to vercel.com
2. "Add New Project"
3. Import from GitHub
4. Select repository
5. Deploy!

**Result:** Every time you save in admin, site updates automatically!

---

## Security

### Password Protection
- Admin page is password protected
- Default password: `soapbox2025`
- Change it in `admin.html` (line with `ADMIN_PASSWORD`)

### GitHub Token
- Stored locally in your browser (localStorage)
- Never shared publicly
- Only you can access it
- Can revoke anytime from GitHub settings

### Best Practices
- Keep admin page local-only (don't upload to server)
- Or use obscure URL + password
- Change password regularly
- Don't commit GitHub token to repository

---

## Troubleshooting

### "Failed to save to GitHub"
- Check repository name format (`username/repo`)
- Verify token has `repo` permissions
- Make sure branch name is correct
- Check token hasn't expired

### "Content not updating on site"
- Make sure you uploaded JSON files to server
- Check file paths are correct
- Clear browser cache
- Check browser console for errors

### "Can't find admin page"
- Make sure `admin.html` is in root directory
- Access via: `yoursite.com/admin.html` or `localhost:8000/admin.html`

---

## Features

✅ **No Code Editing** - Everything managed through admin  
✅ **Visual Interface** - Easy forms, no JSON editing  
✅ **Auto-Save** - With GitHub integration  
✅ **Complete Control** - Manage all site content  
✅ **Safe** - Password protected, local token storage  
✅ **User-Friendly** - Designed for non-technical users  

---

## Next Steps

1. **Test the admin** - Open `admin.html` and explore
2. **Set up GitHub** - Follow steps above for auto-save
3. **Deploy** - Use Netlify/Vercel for automatic deployments
4. **Start managing** - Add your content!

---

**Questions?** Everything is designed to be self-explanatory, but if you get stuck, check the browser console (F12) for error messages.




