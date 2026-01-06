import express from 'express';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get directory name for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load data locally
const DATA_PATH = path.join(__dirname, '../data/indian_states_districts.json');
let statesData = [];

try {
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(rawData);
    statesData = parsed.states;
    console.log("✅ Location Data Loaded Locally");
} catch (error) {
    console.error("❌ Failed to load location data:", error.message);
}

// 1. India ke States fetch karne ka endpoint
router.get('/states', async (req, res) => {
    try {
        const simplifiedStates = statesData.map((item, index) => ({
            state_id: index,
            state_name: item.state
        }));

        res.json({ success: true, states: simplifiedStates });
    } catch (error) {
        console.error("Error fetching states:", error.message);
        res.status(500).json({ success: false, message: "States fetch nahi ho paye" });
    }
});

// 2. State Name ke basis par Districts fetch karna
router.get('/districts/:stateName', async (req, res) => {
    try {
        const { stateName } = req.params;

        // Find state in local data
        const selectedState = statesData.find(item => item.state === stateName);

        if (selectedState) {
            res.json({ success: true, districts: selectedState.districts });
        } else {
            console.warn(`State not found: ${stateName}`);
            res.status(404).json({ success: false, message: "State not found" });
        }
    } catch (error) {
        console.error("Error fetching districts:", error.message);
        res.status(500).json({ success: false, message: "Districts fetch nahi ho paye" });
    }
});

export default router;