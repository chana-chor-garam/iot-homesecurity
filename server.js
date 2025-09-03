  const express = require('express');
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const path = require('path');
  const app = express();
  const PORT = 3000;
  const fs = require('fs').promises;
  const os = require('os');
  const https = require('https');

  // MongoDB connection URI
  const uri = "mongodb+srv://lightbolt129:FP3nSKjHJr5h7HkC@hs.rvpyv8d.mongodb.net/?retryWrites=true&w=majority&appName=hs";
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const ALERT_FILE = path.join(os.homedir(), 'iot', 'p2', 'alertdata.json');
  const ALERT_KEY = 'CGIBAY6BF3VBDCC4';

  async function ensureAlertFile() {
    try { await fs.access(ALERT_FILE); }
    catch {
      await fs.writeFile(ALERT_FILE, JSON.stringify({field1:0,field2:0}), 'utf8');
    }
  }

  // Connect once when the server starts
  async function startServer() {
    try {
      await client.connect();
      console.log("Connected to MongoDB");

      app.use(express.static('public'));
      app.use(express.json());

      // Serve the static HTML page
      app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
      });

      // ---------------------
      //  DOOR ENDPOINTS
      // ---------------------

      // GET all door states
      async function readDoorStatusFile(fileName) {
        try {
          const filePath = path.join(os.homedir(), 'iot', 'p2', fileName);
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          console.error(`Error reading file ${fileName}:`, error);
          return {}; // return empty object on error
        }
      }
      
      app.get('/api/doors', async (req, res) => {
        try {
          const mainDoorData = await readDoorStatusFile('thingspeak-data.json');
          const gardenDoorData = await readDoorStatusFile('thingspeak-data2.json');
      
          const doors = [
            {
              doorName: 'main',
              locked: mainDoorData.field1 == 1,
              open: false,
              lastActivity: new Date().toISOString()
            },
            {
              doorName: 'garden',
              locked: gardenDoorData.field2 == 1,
              open: false,
              lastActivity: new Date().toISOString()
            }
          ];
      
          res.json(doors);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error fetching door states');
        }
      });
    
      // ---------------------
      //  DOOR OPEN SENSOR ENDPOINT
      // ---------------------
      // Optional: ThingSpeak API keys
      // — at the top of the file, alongside your existing maps —
    const thingSpeakKeys = {
      1: 'KKPK57UXMU22DRQP',      // door‑main
      2: 'KKPK57UXMU22DRQP',      // door‑garden
      3: '13B7WD1K8A8W1CJ4',// add‑person channel
      4: 'PXFVMQ63MWER609O', // biometric channel
      5: 'CGIBAY6BF3VBDCC4' //buzzer
    };


    const fileMap = {
      1: 'thingspeak-data.json',
      2: 'thingspeak-data2.json',
      3: 'addperson-data.json',
      4: 'biometric-data.json',
      5: 'alertdata.json' // for the alert system  
    };

  // map each channel to the field number you want it to use
    const channelFieldMap = {
      1: 1,  // door‑main → field1
      2: 2,  // door‑garden → field2
      3: 1,  // add‑person → field1
      4: 1,   // biometric  → field2
      5: 1
    };


    // Add this near your other endpoint definitions
 

  app.get('/api/checkalerts', async (req, res) => {
    try {
      await ensureAlertFile();
      const raw = await fs.readFile(ALERT_FILE, 'utf8');
      const { field1, field2 } = JSON.parse(raw);
      res.json({
        alertTriggered: field1 === 1,
        ledTriggered:   field2 === 1
      });
    } catch (e) {
      console.error('checkalerts error:', e);
      res.json({alertTriggered:false,ledTriggered:false});
    }
  });

  app.post('/api/resetalerts', async (req, res) => {
    try {
      // 1) local reset
      await fs.writeFile(ALERT_FILE, JSON.stringify({field1:0,field2:0}), 'utf8');

      // 2) remote reset
      const tsUrl = `https://api.thingspeak.com/update?api_key=${ALERT_KEY}`
                  + `&field1=0&field2=0`;
      https.get(tsUrl, () => res.json({success:true}))
           .on('error', err => {
             console.error('TS reset error:', err);
             res.status(500).json({success:false});
           });
    } catch (e) {
      console.error('resetalerts error:', e);
      res.status(500).json({success:false});
    }
  });

    app.post('/api/sendChannel', async (req, res) => {
    try {
      const { channel, value } = req.body;

        const fileName = fileMap[channel];
        const apiKey   = thingSpeakKeys[channel];
        const fieldNum = channelFieldMap[channel];

        if (!fileName || !apiKey || !fieldNum) {
          return res.status(400).json({ error: 'Invalid channel or missing configuration' });
        }

        // 1) write to your local JSON mirror
        const filePath = path.join(os.homedir(), 'iot', 'p2', fileName);
        const content  = { [`field${fieldNum}`]: value };
        await fs.writeFile(filePath, JSON.stringify(content), 'utf8');

        // 2) push to ThingSpeak
        const tsUrl = `https://api.thingspeak.com/update?api_key=${apiKey}&field${fieldNum}=${encodeURIComponent(value)}`;
        https.get(tsUrl, () => { /* ignore response */ });

        res.json({ success: true, channel, field: fieldNum, value });
      } catch (err) {
        console.error('Error in sendChannel:', err);
        res.status(500).send('Failed to update channel');
      }
    });


      // ---------------------
      //  PEOPLE ENDPOINTS
      // ---------------------

      // GET all people
      app.get('/api/people', async (req, res) => {
        try {
          const collection = client.db("hs").collection("people");
          const people = await collection.find({}).toArray();
          res.json(people);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error fetching people');
        }
      });

      // POST add a new person – now rejects duplicates
    app.post('/api/people', async (req, res) => {
      const { name, biometricid, doors } = req.body;
      try {
        const collection = client.db("hs").collection("people");
        // ① check for existing biometricid
        const existing = await collection.findOne({ biometricid });
        if (existing) {
          return res
            .status(409)
            .json({ error: 'Biometric ID already registered' });
        }

        // ② otherwise insert
        const result = await collection.insertOne({ name, biometricid, doors });
        res.status(201).json({ insertedId: result.insertedId });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error adding person');
      }
    });


      // PUT update a person – now updates name and door access if provided
      app.put('/api/people/:biometricid', async (req, res) => {
        const biometricid = req.params.biometricid;
        const { name, doors } = req.body;
        try {
          const collection = client.db("hs").collection("people");
          const updateFields = { name };
          if (doors) { 
            updateFields.doors = doors;
          }
          const result = await collection.updateOne(
            { biometricid },
            { $set: updateFields }
          );
          res.json({ modifiedCount: result.modifiedCount });
        } catch (err) {
          console.error(err);
          res.status(500).send('Error updating person');
        }
      });

      // DELETE a person
      app.delete('/api/people/:biometricid', async (req, res) => {
        const biometricid = req.params.biometricid;
        try {
          const collection = client.db("hs").collection("people");
          const result = await collection.deleteOne({ biometricid });
          res.json({ deletedCount: result.deletedCount });
        } catch (err) {
          console.error(err);
          res.status(500).send('Error deleting person');
        }
      });
      
      // ---------------------
      //  EMAIL ENDPOINTS
      // ---------------------
      
      // GET all emails
      app.get('/api/emails', async (req, res) => {
        try {
          const collection = client.db("hs").collection("emails");
          const emails = await collection.find({}).toArray();
          res.json(emails);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error fetching emails');
        }
      });

      // POST add a new email
      app.post('/api/emails', async (req, res) => {
        const { email } = req.body;
        try {
          const collection = client.db("hs").collection("emails");
          const result = await collection.insertOne({ email });
          res.status(201).json({ insertedId: result.insertedId });
        } catch (err) {
          console.error(err);
          res.status(500).send('Error adding email');
        }
      });

      // PUT update an email
      app.put('/api/emails/:email', async (req, res) => {
        const oldEmail = decodeURIComponent(req.params.email);
        const { email } = req.body;
        try {
          const collection = client.db("hs").collection("emails");
          const result = await collection.updateOne(
            { email: oldEmail },
            { $set: { email } }
          );
          res.json({ modifiedCount: result.modifiedCount });
        } catch (err) {
          console.error(err);
          res.status(500).send('Error updating email');
        }
      });

      // DELETE an email
      app.delete('/api/emails/:email', async (req, res) => {
        const email = decodeURIComponent(req.params.email);
        try {
          const collection = client.db("hs").collection("emails");
          const result = await collection.deleteOne({ email });
          res.json({ deletedCount: result.deletedCount });
        } catch (err) {
          console.error(err);
          res.status(500).send('Error deleting email');
        }
      });

      // ---------------------
      //  WINDOW ENDPOINTS
      // ---------------------

      // GET all window states
      async function readWindowStatusFile(fileName) {
        try {
          const filePath = path.join(os.homedir(), 'iot', 'p2', fileName);
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          console.error(`Error reading file ${fileName}:`, error);
          return {}; // return empty object on error
        }
      }
      
      app.get('/api/windows', async (req, res) => {
        try {
          const windowData = await readWindowStatusFile('window-data.json');
      
          const windows = [
            {
              name: 'window',
              locked: windowData.field1 == 1,
              open: false,
              lastActivity: new Date().toISOString()
            }
          ];
      
          res.json(windows);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error fetching door states');
        }
      });

      // ---------------------
      //  INTRUDER ENDPOINTS
      // ---------------------

      // GET all intruder states
      async function readintruderStatusFile(fileName) {
        try {
          const filePath = path.join(os.homedir(), 'iot', 'p2', fileName);
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          console.error(`Error reading file ${fileName}:`, error);
          return {}; // return empty object on error
        }
      }
      
      app.get('/api/intruder', async (req, res) => {
        try {
          const intruderData = await readintruderStatusFile('intruder-data.json');
      
          const intruder = [
            {
              name: 'intruder',
              locked: intruderData.field1 == 1,
              open: false,
              lastActivity: new Date().toISOString()
            }
          ];
      
          res.json(intruder);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error fetching door states');
        }
      });

      async function readLoadingStatusFile(fileName) {
        try {
          const filePath = path.join(os.homedir(), 'iot', 'p2', fileName);
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          console.error(`Error reading file ${fileName}:`, error);
          return { field1: 0 }; // Default to "closed" state if file doesn't exist
        }
      }

      // Add this with your other endpoint definitions
      app.get('/api/loading', async (req, res) => {
        try {
          const loadingData = await readLoadingStatusFile('loading-data.json'); // You'll need to implement this
          res.json([{
            name: 'loading',
            locked: loadingData.field1 == 1, // or whatever field indicates loading status
            lastActivity: new Date().toISOString()
          }]);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error fetching loading status');
        }
      });

      
      // Start server
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Error connecting to MongoDB", error);
    }
  }

  startServer();