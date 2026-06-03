# MDM Environment Documentation

Comprehensive documentation system for Master Data Management environments with Google Sheets backend integration.

## 🌐 Live Site

Visit the documentation: **https://alsommers-ifna-sfdc.github.io/mdm-environment-docs/**

## 📋 Features

- **Master Index Page** - Central hub for all MDM environments
- **Environment Landing Pages** - Detailed documentation per environment with:
  - Overview and metadata
  - Customer demos
  - Use case areas
  - Business entities
  - Hierarchies and relationships
  - Data quality rules
  - CAI processes
  - Data model diagrams
- **Google Sheets Backend** - Real-time data sync and multi-user editing
- **Inline Editing** - Edit documentation directly in the browser
- **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

1. **View Documentation**: Open `index.html` in your browser
2. **Edit Mode**: Open `env-industrial-manufacturing-editable.html` and click "Enable Editing"
3. **Google Sheets Setup**: Follow instructions in `SETUP_GOOGLE_SHEETS.md`

## 📂 Structure

```
Environment Documentation/
├── index.html                              # Master index page
├── env-industrial-manufacturing.html       # Static environment page
├── env-industrial-manufacturing-editable.html  # Editable environment page
├── google-sheets-integration.js            # Google Sheets API integration
├── SETUP_GOOGLE_SHEETS.md                 # Setup instructions
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

## 🤝 Contributing

To add a new environment:
1. Add data to the Google Sheets
2. Create a new `env-{name}.html` page
3. Update `index.html` to include the new environment card
4. Commit and push changes

## 📝 License

Internal Salesforce use only

## 🙋 Support

For questions or issues, contact the MDM team.
