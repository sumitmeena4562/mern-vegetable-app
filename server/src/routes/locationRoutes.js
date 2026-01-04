import express from 'express';
import axios from 'axios';
const router = express.Router();

// Yeh ek Open Source Data hai jo kabhi block nahi hota
const DATA_URL = "https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json";

// 1. India ke States fetch karne ka endpoint
router.get('/states', async (req, res) => {
    try {
        const response = await axios.get(DATA_URL);
        const data = response.data.states;
        
        // Data me se sirf State ka naam aur ID nikal kar frontend ko bhejenge
        // (API ka structure thoda alag hai, isliye map kar rahe hain)
        const simplifiedStates = data.map((item, index) => ({
            state_id: index, // ID nahi hai to index use kar rahe hain
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
        const response = await axios.get(DATA_URL);
        const data = response.data.states;

        // User ne jo State bheja, use dhoondho
        const selectedState = data.find(item => item.state === stateName);

        if (selectedState) {
            res.json({ success: true, districts: selectedState.districts });
        } else {
            res.status(404).json({ success: false, message: "State not found" });
        }
    } catch (error) {
        console.error("Error fetching districts:", error.message);
        res.status(500).json({ success: false, message: "Districts fetch nahi ho paye" });
    }
});

export default router;