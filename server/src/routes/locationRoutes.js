import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON data
const dataPath = path.join(__dirname, '../data/indian_states_districts.json');

const loadLocationData = () => {
    try {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("❌ Error reading location data:", error);
        return { states: [] };
    }
};

// GET /api/locations/states
router.get('/states', (req, res) => {
    const data = loadLocationData();
    const statesList = data.states.map(s => s.state);
    res.status(200).json({
        success: true,
        states: statesList
    });
});

// GET /api/locations/districts/:stateName
router.get('/districts/:stateName', (req, res) => {
    const { stateName } = req.params;
    const data = loadLocationData();

    const stateObj = data.states.find(s => s.state.toLowerCase() === stateName.toLowerCase());

    if (!stateObj) {
        return res.status(404).json({
            success: false,
            message: "State not found"
        });
    }

    res.status(200).json({
        success: true,
        districts: stateObj.districts
    });
});

export default router;
