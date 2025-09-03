// monitor.js
const https = require('https');
const fs = require('fs').promises;

const CHANNEL_ID = 2922408;
const API_URL    = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json`;
const INTERVAL_MS = 5000;
const FILE_PATH   = 'alertdata.json';

async function fetchAndSaveFieldData() {
  try {
    // 1) fetch latest
    const data = await new Promise((resolve, reject) => {
      https
        .get(API_URL, res => {
          let raw = '';
          res.on('data', chunk => raw += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(raw)); }
            catch (e) { reject(e); }
          });
        })
        .on('error', reject);
    });

    // 2) build fresh object (no `|| fileData`)
    const updated = {
      field1: data.field1 != null ? Number(data.field1) : 0,
      field2: data.field2 != null ? Number(data.field2) : 0,
      lastUpdated: new Date().toISOString()
    };

    // 3) write it
    await fs.writeFile(FILE_PATH, JSON.stringify(updated, null, 2), 'utf8');
    console.log(`[${updated.lastUpdated}] Wrote:`, updated);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Monitor error:`, err.message);
  }
}

console.log(`Monitoring ThingSpeak #${CHANNEL_ID} every ${INTERVAL_MS/1000}s`);
fetchAndSaveFieldData();
setInterval(fetchAndSaveFieldData, INTERVAL_MS);
