// server-emails.js
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

const uri = "mongodb+srv://lightbolt129:FP3nSKjHJr5h7HkC@hs.rvpyv8d.mongodb.net/?retryWrites=true&w=majority&appName=hs";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function start() {
  await client.connect();

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/api/emails', async (req, res) => {
    const col = client.db('hs').collection('emails');
    const emails = await col.find({}, { projection: { _id: 0, email: 1 } }).toArray();
    res.json(emails);
  });

  app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    // generate OTP and send via your preferred method
    res.send(`OTP sent to ${email}`);
  });

  app.listen(PORT, () => {
    console.log(`Email‐sync server running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
