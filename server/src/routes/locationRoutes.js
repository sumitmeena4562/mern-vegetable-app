import express from 'express';
import axios from 'axios';
const router = express.Router();


// 1 India ke state fetch karna ka endpoint

router.get('/states',async(req,res)=>{
    //hum coWin ki public API user kar rhe h ye fast h or free h 
try {
   const response = await axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states');
    res.json({success :true ,states:response.data.states});

    
} catch (error) {
    res.status(500).json({success:false,message: "States not fetch!"});
}
 
    
});


//2 State ID ke hisab se Districts fetch krna

router.get('/districts/:stateId',async(req,res)=>{
    try {
        const {statesId} = req.params;
        const response =await axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${statesId}`);
        res.json({success: true, districts: response.data.districts});
    } catch (error) {
        res.status(500).json({ success: false, message: "Districts fetch nahi ho paye" });
    }
})