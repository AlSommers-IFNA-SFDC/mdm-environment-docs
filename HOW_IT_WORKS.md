# How the Dynamic Documentation System Works

## 🎯 Overview

The MDM Environment Documentation system is now **fully dynamic**. Add a new environment to Google Sheets and it automatically appears on the website - no code changes needed!

## 📊 Architecture

### Google Sheets (Data Layer)
- **8 Google Sheets** store all environment data
- Each sheet has a specific purpose (environments, use cases, entities, etc.)
- Edit directly in Google Sheets OR through the web interface

### HTML Pages (Presentation Layer)

#### `index.html` (Master Index)
- **Dynamic**: Loads ALL environments from the `MDM_Environments` Google Sheet
- **Auto-calculates**: Summary statistics (total entities, use cases, etc.)
- **Auto-generates**: Environment cards for each row in the sheet
- **Search**: Filter environments by name or org ID
- **URL**: `https://alsommers-ifna-sfdc.github.io/mdm-environment-docs/`

#### `environment.html` (Universal Template)
- **Single page** that works for ANY environment
- **URL-based**: Uses query parameter to load specific environment
  - Example: `environment.html?env=industrial-manufacturing`
- **Dynamic sections**: Loads all data from Google Sheets based on `env_id`
- **Inline editing**: Click "Enable Editing" to modify data

### JavaScript (`google-sheets-integration.js`)
- Connects to Google Sheets API
- Reads data from public sheets (no auth required for viewing)
- Parses Google Sheets format into JavaScript objects
- Provides update methods (requires OAuth for editing)

## 🚀 Adding a New Environment

### Step 1: Add to Google Sheets

Add a row to `MDM_Environments` sheet:
```
env_id: customer-360
name: Customer 360
org_id: ABC123XYZ
description: Complete customer master data environment
entity_count: 8
use_case_count: 3
demo_count: 4
last_updated: 2026-06-04
```

### Step 2: Add Related Data

Add rows to other sheets with the same `env_id`:

**MDM_Use_Cases:**
```
env_id: customer-360
use_case_id: customer-master
name: Customer Master
description: Single source of truth for customer data
status: Active
```

**MDM_Business_Entities:**
```
env_id: customer-360
entity_name: Customer
entity_id: cust_001
description: Customer master records
use_cases: customer-master
```

**MDM_Customer_Demos:**
```
env_id: customer-360
demo_name: ABC Corp
use_cases: customer-master
notes: Demo for enterprise customer management
```

### Step 3: That's It!

1. Visit the index: https://alsommers-ifna-sfdc.github.io/mdm-environment-docs/
2. Your new "Customer 360" environment appears as a card
3. Click the card to see the full details
4. URL will be: `environment.html?env=customer-360`

**No code changes. No new HTML files. No deployment needed.**

## 🔄 How Data Flows

```
Google Sheets
    ↓
google-sheets-integration.js
    ↓
index.html (loads all environments)
    ↓
User clicks environment card
    ↓
environment.html?env=XXX
    ↓
Loads all data for that env_id
    ↓
Renders page dynamically
```

## ✏️ Editing Data

### Method 1: Google Sheets (Recommended)
1. Open the Google Sheet directly
2. Edit any cell
3. Refresh the web page to see changes

### Method 2: Web Interface
1. Open an environment page
2. Click "Enable Editing" button
3. Click any yellow-highlighted field
4. Edit inline
5. Click away to save (syncs back to Google Sheets)

## 🔧 Technical Details

### URL Structure
- **Index**: `index.html` (no parameters)
- **Environment**: `environment.html?env={env_id}`
  - The `env` parameter must match an `env_id` in the `MDM_Environments` sheet

### JavaScript Functions

**index.html:**
- `loadEnvironments()`: Fetches all environments from Google Sheets
- `renderEnvironments()`: Creates HTML cards for each environment
- `filterEnvironments()`: Search/filter functionality
- `showEmptyState()`: Displays message when no environments exist
- `showError()`: Handles loading errors

**environment.html:**
- `loadEnvironmentData()`: Fetches all data for a specific `env_id`
- `renderEnvironment()`: Builds the page dynamically
- `toggleEditMode()`: Enables/disables inline editing
- `handleEdit()`: Saves changes back to Google Sheets

### Google Sheets API Methods

```javascript
// Read data
await googleSheets.getEnvironments()
await googleSheets.getEnvironment(envId)
await googleSheets.getUseCases(envId)
await googleSheets.getBusinessEntities(envId)
await googleSheets.getCustomerDemos(envId)
await googleSheets.getHierarchies(envId)
await googleSheets.getRelationships(envId)
await googleSheets.getDataQualityRules(envId)
await googleSheets.getCAIProcesses(envId)

// Write data (requires OAuth)
await googleSheets.writeSheet(sheetId, range, values)
await googleSheets.updateRow(sheetId, rowNumber, values)
await googleSheets.findAndUpdateRow(sheetId, matchColumn, matchValue, updates)
```

## 🐛 Troubleshooting

### Environment doesn't appear on index
- Check `env_id` is set in `MDM_Environments` sheet
- Verify sheet is shared as "Anyone with link can view"
- Check browser console for errors
- Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+F5)

### "Environment not found" error
- Ensure `env_id` in URL matches exactly (case-sensitive)
- Check the environment exists in `MDM_Environments` sheet
- Verify Sheet ID is correct in `google-sheets-integration.js`

### Data not loading
- Check all 8 Sheet IDs are configured in `google-sheets-integration.js`
- Verify sheets are publicly readable
- Check browser console for CORS or network errors
- Test sheets individually: open them in browser

### Editing doesn't save
- OAuth must be configured for write access
- Or edit directly in Google Sheets (easier)
- Check browser console for permission errors

## 📈 Scalability

The system can handle:
- **Environments**: Hundreds (limited by Google Sheets 10M cell limit)
- **Entities per environment**: Thousands
- **Page load time**: 1-3 seconds (depends on amount of data)
- **Concurrent users**: Unlimited for reading, coordinate edits manually

## 🔐 Security

- **Public sheets**: Anyone with link can VIEW
- **OAuth editing**: Only authenticated users can EDIT via web interface
- **Direct sheet editing**: Based on Google Sheets sharing permissions
- **No sensitive data**: Don't put credentials or PII in these sheets

## 💡 Best Practices

1. **Naming**: Use kebab-case for `env_id` (e.g., `customer-360`, not `Customer 360`)
2. **Consistency**: Keep same `env_id` across all sheets
3. **Validation**: Test new environments before sharing with team
4. **Backups**: Google Sheets has version history - use it!
5. **Updates**: Push local HTML changes to GitHub to deploy
6. **Documentation**: Update this file when adding new features

## 🎓 For Developers

### Adding a New Section

To add a new section (e.g., "Data Models"):

1. Create new Google Sheet: `MDM_Data_Models`
2. Add Sheet ID to `google-sheets-integration.js`:
   ```javascript
   data_models: 'YOUR_NEW_SHEET_ID'
   ```
3. Add getter method:
   ```javascript
   async getDataModels(envId) {
       const models = await this.readSheet(CONFIG.SHEET_IDS.data_models);
       return models.filter(m => m.env_id === envId);
   }
   ```
4. Update `environment.html` to render the new section
5. Add nav item to sidebar

### Customizing Styles

All styles are inline in each HTML file. Look for:
- Colors: Search for `#0176D3` (Salesforce blue)
- Fonts: Search for `font-family`
- Layout: Look in `.main-content` and `.sidebar` sections

### Testing Locally

```bash
# Simple HTTP server
python3 -m http.server 8000

# Then open: http://localhost:8000/index.html
```

Note: CORS may block Google Sheets API locally. Test on GitHub Pages for full functionality.

## 📞 Support

Questions? Check:
1. Browser console for errors
2. Google Sheets sharing permissions
3. Sheet IDs in `google-sheets-integration.js`
4. This documentation!
