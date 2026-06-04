# Fix: Make Google Sheets Publicly Accessible

## The Problem

You're seeing "Failed to fetch" because your Google Sheets are currently **private**. They need to be shared publicly for the website to read them.

## The Solution: Make Sheets Public

For **each of your 8 Google Sheets**, follow these steps:

### Step-by-Step Instructions

1. **Open the Google Sheet** (e.g., MDM_Environments)

2. **Click the "Share" button** (top-right corner)

3. **Change access level:**
   - Click "Change" next to "Restricted"
   - Select **"Anyone with the link"**
   - Set permission to **"Viewer"** (not Editor!)
   - Click "Done"

4. **Verify the link:**
   - The link should show: "Anyone with the link can view"
   - 🔓 Icon = Public
   - 🔒 Icon = Still private (fix this!)

### Sheets to Update (All 8)

Make sure ALL of these are public:

- ✅ **MDM_Environments** - `1L9W4_kUfDPWOrZKZZVjZkpAHB80kadyj3uGgDqvoWRU`
- ✅ **MDM_Use_Cases** - `1wItpKtnHXZgXPirEQ_s26ZqLFwynbNp1J3fuUdJiEDw`
- ✅ **MDM_Business_Entities** - `1CQTt8qQRYiLPNhYQlKnqxkYFM5-tONDfPHg6hJD1BPM`
- ✅ **MDM_Customer_Demos** - `1rQj98r6E6G7vhnHM4Rfux3lZyC9RL85TI9QBjvhML6Y`
- ✅ **MDM_Hierarchies** - `10yoDt_VAjn9Hkhl6GoZQgHvhfE10SwOfb5yG9Usbwdg`
- ✅ **MDM_Relationships** - `13P_BjoppHlPRQtzgrX-lv9XxhlV153FJUBcxgBZviEs`
- ✅ **MDM_Data_Quality_Rules** - `1OL0lz9Z4RPK1hRoCv6waD-56lbeXwSfP2s5X21RSvcQ`
- ✅ **MDM_CAI_Processes** - `1mGJV45qSKuEfmftWgtrOGp6H5r9AY45IaXw_CfXZHJo`

## Test If It Worked

After making the sheets public, test one:

1. Open this URL in a **private/incognito browser window**:
   ```
   https://docs.google.com/spreadsheets/d/1L9W4_kUfDPWOrZKZZVjZkpAHB80kadyj3uGgDqvoWRU/edit
   ```

2. You should see the sheet **without logging in**

3. If you're asked to sign in, the sheet is still private - repeat the steps above

## After Making Sheets Public

1. **Refresh your documentation site:**
   ```
   https://alsommers-ifna-sfdc.github.io/mdm-environment-docs/
   ```

2. The data should load automatically!

## Security Notes

**Is this safe?**
- ✅ Public = Anyone with link can **VIEW**
- ✅ They CANNOT edit (set to "Viewer" only)
- ✅ No one can find it without the link (not indexed by Google)
- ✅ Perfect for internal Salesforce sharing

**What NOT to put in public sheets:**
- ❌ Passwords or credentials
- ❌ Personal information (SSN, emails, etc.)
- ❌ Confidential business data
- ✅ OK for: Environment names, Org IDs, entity names, use cases

## Alternative: OAuth (More Secure)

If you can't make sheets public, you can set up OAuth authentication:

1. Follow the OAuth setup guide in `SETUP_GOOGLE_SHEETS.md`
2. Update `google-sheets-integration.js`:
   ```javascript
   USE_OAUTH: true
   ```
3. Add your OAuth credentials
4. Users will need to sign in to Google to view

**For now, public sheets are easier and work great for internal use!**

## Still Not Working?

If you made sheets public and still get "Failed to fetch":

1. **Hard refresh the page:** Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
2. **Clear browser cache**
3. **Try a different browser**
4. **Check browser console** (F12) for specific error messages
5. **Test from GitHub Pages** instead of opening local file

## Quick Test Command

Run this in your terminal to test if sheets are public:

```bash
curl -s "https://docs.google.com/spreadsheets/d/1L9W4_kUfDPWOrZKZZVjZkpAHB80kadyj3uGgDqvoWRU/gviz/tq?tqx=out:json" | head -5
```

If you see JSON data → ✅ Public!
If you see HTML/login page → ❌ Still private
