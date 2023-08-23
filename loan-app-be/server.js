// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const customerRoutes = require('./routes');
// const calculateAmortization = require('./calculateAmortization');

const app = express();

// Use the cors middleware to handle CORS
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/loan_app_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Use bodyParser for JSON parsing
app.use(bodyParser.json());
// Define your routes here
app.use('/api', customerRoutes);
// app.post('/calculate-amortization', (req, res) => {
//     const { loanAmount, interestRate, loanTerm } = req.body;
  
//     const amortizationSchedule = calculateAmortization(loanAmount, interestRate, loanTerm);
//     res.json(amortizationSchedule);
//   });
app.get('/', (req, res) => {
    res.send('Hello, this is your Node.js server!');
  });
// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
