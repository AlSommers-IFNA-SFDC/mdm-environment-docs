# Google Sheets Backend Setup Guide

## Step 1: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Click **New** → **Folder**
3. Name it: `Environment Documentation`
4. Note the folder ID from the URL (you'll need this later)
    https://drive.google.com/drive/folders/12ux1vp1lrMGHLIfvt-D5aXbwnKZpdbJ2

## Step 2: Create Google Sheets

Create the following sheets in your "Environment Documentation" folder:

### Sheet 1: `Environments` (Master list)
Create a new Google Sheet named: **MDM_Environments**

**Columns:**
| Column | Description |
|--------|-------------|
| env_id | Unique ID (e.g., industrial-manufacturing) |
| name | Display name |
| org_id | MDM Org ID |
| description | Environment description |
| entity_count | Number of entities |
| use_case_count | Number of use cases |
| demo_count | Number of demos |
| last_updated | Last update timestamp |

**Initial Data:**
```
env_id: industrial-manufacturing
name: Industrial Manufacturing
org_id: 7XRX7lLm9QEkrgxi7U2J2R
description: Master data management environment supporting manufacturing operations
entity_count: 11
use_case_count: 5
demo_count: 6
last_updated: 2026-06-03
```

### Sheet 2: `Use_Cases`
Create a new Google Sheet named: **MDM_Use_Cases**

**Columns:**
| Column | Description |
|--------|-------------|
| env_id | Environment ID (foreign key) |
| use_case_id | Unique ID (kebab-case) |
| name | Display name |
| description | Description |
| status | Status (Active, Planned, etc.) |

**Initial Data:**
```
env_id: industrial-manufacturing
use_case_id: supplier-mastering
name: Supplier Mastering
description: Match/Merge/Survivorship capabilities for supplier data quality and consolidation
status: Active

env_id: industrial-manufacturing
use_case_id: distributor-network
name: Distributor Network
description: Material Consolidation and Parent Relationships for distributor hierarchy management
status: Active

env_id: industrial-manufacturing
use_case_id: bom
name: Bill of Materials (BOM)
description: Raw Material, Semi-Finished, and Finished Goods product structure management
status: Active

env_id: industrial-manufacturing
use_case_id: supply-chain
name: Supply Chain
description: Plant and Production Line master data for manufacturing operations
status: Active

env_id: industrial-manufacturing
use_case_id: product360
name: Product360
description: Product Categorization and Dynamic Attributes for comprehensive product management
status: Active
```

### Sheet 3: `Business_Entities`
Create a new Google Sheet named: **MDM_Business_Entities**

**Columns:**
| Column | Description |
|--------|-------------|
| env_id | Environment ID |
| entity_name | Entity name with variants in parentheses |
| entity_id | MDM Entity ID |
| description | Description |
| use_cases | Comma-separated use case IDs |
| record_count | Number of records |

**Initial Data:**
```
env_id: industrial-manufacturing
entity_name: Supplier (Vendor, Distributor)
entity_id: TBD
description: Vendor and Distributor master data
use_cases: supplier-mastering,distributor-network

env_id: industrial-manufacturing
entity_name: Material
entity_id: TBD
description: Raw materials, semi-finished, and finished goods
use_cases: bom,product360

env_id: industrial-manufacturing
entity_name: Item (Product)
entity_id: TBD
description: Product catalog with categorization
use_cases: product360,bom

env_id: industrial-manufacturing
entity_name: Category
entity_id: TBD
description: Product and material categorization
use_cases: product360

env_id: industrial-manufacturing
entity_name: Material Category
entity_id: TBD
description: Material-specific categorization hierarchy
use_cases: product360

env_id: industrial-manufacturing
entity_name: Business Unit
entity_id: TBD
description: Organizational business units
use_cases: supply-chain

env_id: industrial-manufacturing
entity_name: Organization
entity_id: TBD
description: Distributor and organizational entities
use_cases: distributor-network,supply-chain

env_id: industrial-manufacturing
entity_name: Legal Entity
entity_id: TBD
description: Legal entity master data
use_cases: distributor-network

env_id: industrial-manufacturing
entity_name: Person (Farm Customer, Customer)
entity_id: TBD
description: Farm Customer and Customer contacts
use_cases: distributor-network

env_id: industrial-manufacturing
entity_name: Contact
entity_id: TBD
description: Contact information for entities
use_cases: supplier-mastering

env_id: industrial-manufacturing
entity_name: Region
entity_id: TBD
description: Geographic regions for distribution and operations
use_cases: supply-chain
```

### Sheet 4: `Customer_Demos`
Create a new Google Sheet named: **MDM_Customer_Demos**

**Columns:**
| Column | Description |
|--------|-------------|
| env_id | Environment ID |
| demo_name | Customer demo name |
| use_cases | Comma-separated use case IDs |
| notes | Additional notes |

**Initial Data:**
```
env_id: industrial-manufacturing
demo_name: Seaman Paper
use_cases: TBD
notes: To be configured

env_id: industrial-manufacturing
demo_name: Messer
use_cases: TBD
notes: To be configured

env_id: industrial-manufacturing
demo_name: Entegris
use_cases: TBD
notes: To be configured

env_id: industrial-manufacturing
demo_name: Sinclair
use_cases: TBD
notes: To be configured

env_id: industrial-manufacturing
demo_name: Koch
use_cases: TBD
notes: To be configured

env_id: industrial-manufacturing
demo_name: AgCo
use_cases: TBD
notes: To be configured
```

### Sheet 5: `Hierarchies`
Create a new Google Sheet named: **MDM_Hierarchies**

**Columns:**
| Column | Description |
|--------|-------------|
| env_id | Environment ID |
| hierarchy_name | Hierarchy name |
| levels | JSON array or comma-separated levels |
| root_node | Root node name |
| description | Description |

### Sheet 6: `Relationships`
Create a new Google Sheet named: **MDM_Relationships**

**Columns:**
| Column | Description |
|--------|-------------|
| env_id | Environment ID |
| from_entity | Source entity |
| to_entity | Target entity |
| relationship_type | Type of relationship |
| cardinality | e.g., 1:M, M:M |
| description | Description |

### Sheet 7: `Data_Quality_Rules`
Create a new Google Sheet named: **MDM_Data_Quality_Rules**

**Columns:**
| Column | Description |
|--------|-------------|
| env_id | Environment ID |
| rule_name | Rule name |
| entity | Entity name |
| rule_type | Type (validation, match, merge) |
| description | Description |
| status | Active/Inactive |

### Sheet 8: `CAI_Processes`
Create a new Google Sheet named: **MDM_CAI_Processes**

**Columns:**
| Column | Description |
|--------|-------------|
| env_id | Environment ID |
| process_name | Process name |
| schedule | Cron or description |
| last_run | Last run timestamp |
| status | Status (Success, Failed, etc.) |
| dependencies | Comma-separated process names |

## Step 3: Make Sheets Publicly Readable (or setup OAuth)

For each sheet, you have two options:

### Option A: Public Read-Only (Simplest)
1. Click **Share** on each sheet
2. Change to "Anyone with the link can **view**"
3. Note the Sheet ID from the URL

### Option B: OAuth Authentication (More Secure)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "MDM Environment Docs"
3. Enable Google Sheets API
4. Create OAuth 2.0 credentials
5. Download credentials JSON
6. Follow the OAuth setup in `google-sheets-auth.js`

## Step 4: Configure the Integration

1. Open `config.js` in your Environment Documentation folder
2. Add your Google Sheet IDs:

```javascript
const GOOGLE_SHEETS_CONFIG = {
  environments: '1L9W4_kUfDPWOrZKZZVjZkpAHB80kadyj3uGgDqvoWRU,
  use_cases: '1wItpKtnHXZgXPirEQ_s26ZqLFwynbNp1J3fuUdJiEDw',
  business_entities: '1CQTt8qQRYiLPNhYQlKnqxkYFM5-tONDfPHg6hJD1BPM',
  customer_demos: '1rQj98r6E6G7vhnHM4Rfux3lZyC9RL85TI9QBjvhML6Y,
  hierarchies: '10yoDt_VAjn9Hkhl6GoZQgHvhfE10SwOfb5yG9Usbwdg',
  relationships: '13P_BjoppHlPRQtzgrX-lv9XxhlV153FJUBcxgBZviEs',
  data_quality_rules: '1OL0lz9Z4RPK1hRoCv6waD-56lbeXwSfP2s5X21RSvcQ',
  cai_processes: '1mGJV45qSKuEfmftWgtrOGp6H5r9AY45IaXw_CfXZHJo'
};
```

3. Choose authentication method in `config.js`:
   - `USE_OAUTH: false` for public sheets
   - `USE_OAUTH: true` for OAuth

## Step 5: Extract Sheet IDs

From each Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```

Copy the `SHEET_ID_HERE` part.

## Next Steps

After completing these steps:
1. Run the updated HTML files
2. Test the read functionality
3. Enable editing by clicking the "Edit Mode" button
4. Changes will sync to Google Sheets in real-time

## Troubleshooting

**CORS errors**: Use the included proxy server or enable CORS on your sheets
**Authentication errors**: Check OAuth credentials and scopes
**Permission denied**: Ensure sheets are shared correctly
