import { readdirSync } from 'fs';
import { join } from 'path';

const routesDir = './src/routes';
const files = readdirSync(routesDir);

for (const file of files) {
    if (file.endsWith('.js')) {
        try {
            console.log(`Testing ${file}...`);
            const mod = await import(`./src/routes/${file}`);
            console.log(`✅ ${file} loaded successfully. Default export: ${!!mod.default}`);
        } catch (err) {
            console.error(`❌ ${file} failed to load:`);
            console.error(err);
        }
    }
}
