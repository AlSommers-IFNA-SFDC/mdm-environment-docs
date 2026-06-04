# MDM Environment Documentation

Comprehensive documentation system for Master Data Management environments with Google Sheets backend integration.

## 🌐 Live Site

Visit the documentation: **https://alsommers-ifna-sfdc.github.io/mdm-environment-docs/**

## 📋 Features

- **Dynamic Master Index** - Automatically loads all environments from Google Sheets
- **Universal Environment Template** - Single page that displays any environment dynamically
- **Google Sheets Backend** - Real-time data sync and multi-user editing
- **Inline Editing** - Edit documentation directly in the browser
- **Auto-Discovery** - Add environment to Google Sheets → appears automatically on index
- **URL-based Navigation** - Clean URLs with query parameters (e.g., `?env=industrial-manufacturing`)
- **Responsive Design** - Works on desktop and mobile
- **Search & Filter** - Find environments quickly

### Environment Pages Include:
- Overview and metadata
- Customer demos
- Use case areas
- Business entities
- Hierarchies and relationships
- Data quality rules
- CAI processes

## 🚀 Quick Start

1. **View Documentation**: Open `index.html` in your browser
2. **Edit Mode**: Open `env-industrial-manufacturing-editable.html` and click "Enable Editing"
3. **Google Sheets Setup**: Follow instructions in `SETUP_GOOGLE_SHEETS.md`

## 📂 Structure

```
Environment Documentation/
├── index.html                              # Dynamic master index (loads from Sheets)
├── environment.html                        # Universal environment template
├── google-sheets-integration.js            # Google Sheets API integration
├── SETUP_GOOGLE_SHEETS.md                 # Setup instructions
├── push-updates.sh                         # Helper script to push to GitHub
├── index-static-backup.html               # Original static index (backup)
├── env-industrial-manufacturing.html       # Original static pages (backup)
└── README.md                               # This file
```

## 🔧 Configuration

1. Create Google Sheets following `SETUP_GOOGLE_SHEETS.md`
2. Update Sheet IDs in `google-sheets-integration.js`:
   ```javascript
   SHEET_IDS: {
       environments: 'YOUR_SHEET_ID',
       use_cases: 'YOUR_SHEET_ID',
       // ... etc
   }
   ```
3. Open the editable HTML files to start using

## 🤝 Adding New Environments

To add a new environment (fully automated):
1. Add a row to the `MDM_Environments` Google Sheet with the new environment details
2. Add corresponding data to other sheets (use cases, entities, demos, etc.)
3. The environment automatically appears on the index page
4. Click the environment card to view its details

No code changes or new HTML files needed! Everything is dynamic.

## 📝 License

Internal Salesforce use only

## 🙋 Support

For questions or issues, contact the MDM team.
