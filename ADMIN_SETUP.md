# Admin Page Setup & Security

## Password Protection

The admin page (`admin.html`) is protected with a simple password. 

**To change the password:**
1. Open `admin.html`
2. Find this line: `const ADMIN_PASSWORD = 'soapbox2025';`
3. Change `'soapbox2025'` to your own password
4. Save the file

## Deployment Options

### Option 1: Keep Admin Local Only (Recommended)
- Don't upload `admin.html` to your web server
- Keep it only on your local machine
- Access it via `file://` or local server when needed
- Add `admin.html` to `.gitignore` if using version control

### Option 2: Deploy with Password Protection
- Upload `admin.html` to your server
- Change the password (see above)
- Access via: `yoursite.com/admin.html`
- Password is stored in sessionStorage (clears when browser closes)

### Option 3: Use Obscure URL
- Rename `admin.html` to something obscure like `x7k9m2p.html`
- Don't link to it anywhere
- Only you know the URL
- Still change the password for extra security

## Security Notes

⚠️ **Important:** This is client-side password protection. It's good enough to prevent casual access, but:
- Anyone who views the page source can see the password
- It's not suitable for highly sensitive data
- For a personal blog/content site, this level of protection is usually sufficient

## Usage

1. Open `admin.html` in your browser
2. Enter the password when prompted
3. Add/edit dispatches
4. Copy the generated JSON
5. Paste into `data/dispatches.json`
6. Upload updated `dispatches.json` to your server

## Best Practice

For maximum security:
- Keep `admin.html` local only
- Use a strong password
- Don't commit `admin.html` to public repositories
- Consider using a local development server




