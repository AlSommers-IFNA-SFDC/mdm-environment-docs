/**
 * Google Sheets Integration for MDM Environment Documentation
 *
 * This module handles reading and writing data to Google Sheets.
 * Supports both public sheets (simple) and OAuth authentication (secure).
 */

// Configuration - Replace with your actual Sheet IDs
const CONFIG = {
    // Set to true if using OAuth, false for public sheets
    USE_OAUTH: false,

    // Google Sheets IDs - Get these from your sheet URLs
    SHEET_IDS: {
        environments: '1L9W4_kUfDPWOrZKZZVjZkpAHB80kadyj3uGgDqvoWRU',
        use_cases: '1wItpKtnHXZgXPirEQ_s26ZqLFwynbNp1J3fuUdJiEDw',
        business_entities: '1CQTt8qQRYiLPNhYQlKnqxkYFM5-tONDfPHg6hJD1BPM',
        customer_demos: '1rQj98r6E6G7vhnHM4Rfux3lZyC9RL85TI9QBjvhML6Y',
        hierarchies: '10yoDt_VAjn9Hkhl6GoZQgHvhfE10SwOfb5yG9Usbwdg',
        relationships: '13P_BjoppHlPRQtzgrX-lv9XxhlV153FJUBcxgBZviEs',
        data_quality_rules: '1OL0lz9Z4RPK1hRoCv6waD-56lbeXwSfP2s5X21RSvcQ',
        cai_processes: '1mGJV45qSKuEfmftWgtrOGp6H5r9AY45IaXw_CfXZHJo'
    },

    // OAuth Configuration (if USE_OAUTH is true)
    OAUTH: {
        CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
        API_KEY: 'YOUR_API_KEY',
        DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
        SCOPES: 'https://www.googleapis.com/auth/spreadsheets'
    }
};

class GoogleSheetsAPI {
    constructor() {
        this.gapiInited = false;
        this.gisInited = false;
        this.tokenClient = null;
    }

    /**
     * Initialize the Google Sheets API
     */
    async init() {
        if (CONFIG.USE_OAUTH) {
            await this.initOAuth();
        }
        return true;
    }

    /**
     * Initialize OAuth authentication
     */
    async initOAuth() {
        // Load the Google API client
        await this.loadScript('https://apis.google.com/js/api.js');
        await this.loadScript('https://accounts.google.com/gsi/client');

        gapi.load('client', async () => {
            await gapi.client.init({
                apiKey: CONFIG.OAUTH.API_KEY,
                discoveryDocs: [CONFIG.OAUTH.DISCOVERY_DOC],
            });
            this.gapiInited = true;
        });

        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CONFIG.OAUTH.CLIENT_ID,
            scope: CONFIG.OAUTH.SCOPES,
            callback: '', // defined later
        });
        this.gisInited = true;
    }

    /**
     * Load external script
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Request OAuth token
     */
    async requestAccessToken() {
        return new Promise((resolve, reject) => {
            this.tokenClient.callback = (response) => {
                if (response.error) {
                    reject(response);
                } else {
                    resolve(response);
                }
            };
            this.tokenClient.requestAccessToken();
        });
    }

    /**
     * Read data from a Google Sheet (Public method - no auth required)
     */
    async readPublicSheet(sheetId, range = 'Sheet1!A1:Z1000') {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&range=${range}`;

        try {
            const response = await fetch(url);
            const text = await response.text();

            // Check if we got an HTML response (means sheet is private)
            if (text.trim().startsWith('<!DOCTYPE html>') || text.trim().startsWith('<html')) {
                throw new Error(`Sheet ${sheetId} is not publicly accessible. Please share it as "Anyone with the link can view". See FIX_SHEETS_SHARING.md for instructions.`);
            }

            // Check for Google Sheets error responses
            if (text.includes('google.visualization.Query.setResponse')) {
                const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/);
                if (jsonMatch) {
                    const responseData = JSON.parse(jsonMatch[1]);
                    if (responseData.status === 'error') {
                        throw new Error(`Google Sheets error: ${responseData.errors[0].detailed_message || responseData.errors[0].reason}`);
                    }
                }
            }

            // Google Sheets returns JSONP, need to parse it
            const jsonString = text.substring(47, text.length - 2);
            const data = JSON.parse(jsonString);

            return this.parseGoogleSheetsData(data);
        } catch (error) {
            console.error('Error reading public sheet:', error);
            console.error('Sheet ID:', sheetId);
            console.error('URL:', url);
            throw error;
        }
    }

    /**
     * Read data from Google Sheet (OAuth method)
     */
    async readSheet(sheetId, range = 'Sheet1!A1:Z1000') {
        if (!CONFIG.USE_OAUTH) {
            return this.readPublicSheet(sheetId, range);
        }

        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: range,
            });

            return this.parseSheetValues(response.result.values);
        } catch (error) {
            console.error('Error reading sheet:', error);
            throw error;
        }
    }

    /**
     * Write data to Google Sheet (requires OAuth)
     */
    async writeSheet(sheetId, range, values) {
        if (!CONFIG.USE_OAUTH) {
            throw new Error('Writing requires OAuth authentication. Set USE_OAUTH to true.');
        }

        try {
            const response = await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: sheetId,
                range: range,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: values
                }
            });

            return response.result;
        } catch (error) {
            console.error('Error writing to sheet:', error);
            throw error;
        }
    }

    /**
     * Append data to Google Sheet (requires OAuth)
     */
    async appendSheet(sheetId, range, values) {
        if (!CONFIG.USE_OAUTH) {
            throw new Error('Appending requires OAuth authentication. Set USE_OAUTH to true.');
        }

        try {
            const response = await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: range,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: values
                }
            });

            return response.result;
        } catch (error) {
            console.error('Error appending to sheet:', error);
            throw error;
        }
    }

    /**
     * Parse Google Sheets visualization data format
     */
    parseGoogleSheetsData(data) {
        const rows = [];
        const cols = data.table.cols.map(col => col.label || '');

        data.table.rows.forEach(row => {
            const rowData = {};
            row.c.forEach((cell, index) => {
                rowData[cols[index]] = cell ? cell.v : null;
            });
            rows.push(rowData);
        });

        return rows;
    }

    /**
     * Parse sheet values (array format) to object array
     */
    parseSheetValues(values) {
        if (!values || values.length === 0) {
            return [];
        }

        const headers = values[0];
        const rows = values.slice(1);

        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || null;
            });
            return obj;
        });
    }

    /**
     * Get all environments
     */
    async getEnvironments() {
        return this.readSheet(CONFIG.SHEET_IDS.environments);
    }

    /**
     * Get environment by ID
     */
    async getEnvironment(envId) {
        const environments = await this.getEnvironments();
        return environments.find(env => env.env_id === envId);
    }

    /**
     * Get use cases for an environment
     */
    async getUseCases(envId) {
        const useCases = await this.readSheet(CONFIG.SHEET_IDS.use_cases);
        return useCases.filter(uc => uc.env_id === envId);
    }

    /**
     * Get business entities for an environment
     */
    async getBusinessEntities(envId) {
        const entities = await this.readSheet(CONFIG.SHEET_IDS.business_entities);
        return entities.filter(entity => entity.env_id === envId);
    }

    /**
     * Get customer demos for an environment
     */
    async getCustomerDemos(envId) {
        const demos = await this.readSheet(CONFIG.SHEET_IDS.customer_demos);
        return demos.filter(demo => demo.env_id === envId);
    }

    /**
     * Get hierarchies for an environment
     */
    async getHierarchies(envId) {
        const hierarchies = await this.readSheet(CONFIG.SHEET_IDS.hierarchies);
        return hierarchies.filter(h => h.env_id === envId);
    }

    /**
     * Get relationships for an environment
     */
    async getRelationships(envId) {
        const relationships = await this.readSheet(CONFIG.SHEET_IDS.relationships);
        return relationships.filter(r => r.env_id === envId);
    }

    /**
     * Get data quality rules for an environment
     */
    async getDataQualityRules(envId) {
        const rules = await this.readSheet(CONFIG.SHEET_IDS.data_quality_rules);
        return rules.filter(rule => rule.env_id === envId);
    }

    /**
     * Get CAI processes for an environment
     */
    async getCAIProcesses(envId) {
        const processes = await this.readSheet(CONFIG.SHEET_IDS.cai_processes);
        return processes.filter(proc => proc.env_id === envId);
    }

    /**
     * Update a single cell
     */
    async updateCell(sheetId, cell, value) {
        return this.writeSheet(sheetId, cell, [[value]]);
    }

    /**
     * Update a row
     */
    async updateRow(sheetId, rowNumber, values) {
        const range = `Sheet1!A${rowNumber}:Z${rowNumber}`;
        return this.writeSheet(sheetId, range, [values]);
    }

    /**
     * Find and update a row by matching column value
     */
    async findAndUpdateRow(sheetId, matchColumn, matchValue, updates) {
        const allData = await this.readSheet(sheetId);
        const rowIndex = allData.findIndex(row => row[matchColumn] === matchValue);

        if (rowIndex === -1) {
            throw new Error(`Row with ${matchColumn}=${matchValue} not found`);
        }

        // Row index + 2 (1 for 0-based, 1 for header row)
        const rowNumber = rowIndex + 2;

        // Merge updates into existing row
        const updatedRow = { ...allData[rowIndex], ...updates };
        const values = Object.values(updatedRow);

        return this.updateRow(sheetId, rowNumber, values);
    }
}

// Export singleton instance
const googleSheets = new GoogleSheetsAPI();

// Auto-initialize on load
if (typeof window !== 'undefined') {
    window.googleSheets = googleSheets;
    window.addEventListener('load', () => {
        googleSheets.init().catch(console.error);
    });
}
