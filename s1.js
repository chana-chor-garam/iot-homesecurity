const https = require('https');
const fs = require('fs');

const URL = 'https://thingspeak.mathworks.com/channels/2913693/fields/1/last.json';
const URL2 = 'https://thingspeak.mathworks.com/channels/2913693/fields/2/last.json';
const INTERVAL_MS = 5000;
const FILE_PATH = 'thingspeak-data.json';
const FILE_PATH2 = 'thingspeak-data2.json'

function fetchAndPrint() {
  https.get(URL, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      try {
        const data = JSON.parse(raw);
        console.log(new Date().toISOString(), 'field1 =', data.field1);

        fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Failed to write JSON to file:', err);
          } else {
            console.log(new Date().toISOString(), 'Data saved to', FILE_PATH);
          }
        });
      } catch (err) {
        console.error('Failed to parse JSON:', err);
      }
    });
  }).on('error', (err) => {
    console.error('Request error:', err);
  });

  https.get(URL2, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      try {
        const data = JSON.parse(raw);
        console.log(new Date().toISOString(), 'field2 =', data.field2);

        fs.writeFile(FILE_PATH2, JSON.stringify(data, null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Failed to write JSON to file:', err);
          } else {
            console.log(new Date().toISOString(), 'Data saved to', FILE_PATH2);
          }
        });
      } catch (err) {
        console.error('Failed to parse JSON:', err);
      }
    });
  }).on('error', (err) => {
    console.error('Request error:', err);
  });
}

fetchAndPrint();
setInterval(fetchAndPrint, INTERVAL_MS);
