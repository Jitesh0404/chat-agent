require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const chatRouter = require('./routes/chat.routes');
const uploadRouter = require('./routes/upload.routes');
const errorHandler = require('./middleware/error');
const connectDB = require('./db/connectDB');
const { testDatabase } = require('./db/testDatabase');
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/chat', chatRouter);
app.use('/api/upload',uploadRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  connectDB.getClient().then(() => {
    console.log('Connected to the database');
    testDatabase(); // Call the testDatabase function to verify the connection
  }).catch((error) => {
    console.error('Database connection error:', error);
  });
  console.log(`Server is running on http://localhost:${PORT }`);
});




module.exports = app;