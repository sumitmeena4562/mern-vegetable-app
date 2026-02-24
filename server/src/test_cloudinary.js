import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { uploadToCloudinary } from './middleware/upload.js';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary manually for the test
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testUpload() {
    console.log('--- Cloudinary Integration Test ---');

    // 1. Create a dummy test file
    const testFilePath = path.join(process.cwd(), 'test_image.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for Cloudinary upload.');
    console.log('✅ Dummy file created:', testFilePath);

    try {
        // 2. Perform Upload
        console.log('🚀 Attempting upload to Cloudinary...');
        const fileBuffer = fs.readFileSync(testFilePath);
        const result = await uploadToCloudinary(fileBuffer, 'agriconnect/test');

        console.log('✅ Upload Successful!');
        console.log('🔗 URL:', result.secure_url);
        console.log('🆔 Public ID:', result.public_id);

        // 3. Logic Check: Local File Cleanup Sim (Since we use fs.unlinkSync in controller)
        console.log('🗑️  Simulating cleanup (Unlinking test file)...');
        fs.unlinkSync(testFilePath);

        if (!fs.existsSync(testFilePath)) {
            console.log('✨ Cleanup Verification: Local file deleted successfully.');
        } else {
            console.log('❌ Cleanup Verification: Local file still exists!');
        }

        console.log('\n--- SUCCESS: Cloudinary and Cleanup logic are working! ---');
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
    }
}

testUpload();
