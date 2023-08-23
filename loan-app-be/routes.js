
const express = require('express');
const Customer = require('./models');

const router = express.Router();
const AuditTrail = require('./models'); 


router.post('/register', async (req, res) => {
  
  
  try {
    const {
      customerName,
      gurrantorName,
      status,
      loanAmount,
      interestRate,
      tenure,
    } = req.body;

    const customer = new Customer({
      customerName,
      gurrantorName,
      status,
      loanAmount,
      interestRate,
      tenure,
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all customers
router.get('/customers', async (req, res) => {


    try {
      const customers = await Customer.find();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching customers.' });
    }
})

// Get customer by customId
router.get('/customers/:customId', async (req, res) => {
 
  try {
      const customId = req.params.customId;
      const customer = await Customer.findOne({ customId });
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the customer.' });
    }
})

// Update customer by customId
router.put('/customers/:customId', async (req, res) => {
 
  try {
      const customId = req.params.customId;
      const updates = req.body; // Request body should contain the fields to update
  
      const customer = await Customer.findOneAndUpdate({ customId }, updates, {
        new: true, // Return the updated document
      });
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the customer.' });
    }
  });

  // Delete customer by customId
  
router.delete('/customers/:customId', async (req, res) => {
   
 
  try {
      
      const customId = req.params.customId;
  
      const customer = await Customer.findOneAndDelete({ customId });
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      res.status(200).json({ message: 'Customer deleted successfully.' });
    }
    catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the customer.' });
    }
  });

  
// Define a POST route to record audit trail data
router.post('/auditTrail/:customId', async (req, res) => {
    const { customId } = req.params;
   
    const { previousData, updatedData } = req.body;
  
    try {
      const auditTrailEntry = new AuditTrail({
        customId, // Use the customId from the URL parameters
        previousData,
        updatedData,
        timestamp: new Date(),
      });
      console.log(previousData);
     // console.log(timestamp);
      await auditTrailEntry.save();
      console.log("AuditTAril saved");
      res.status(200).json({ message: 'Audit trail recorded successfully' });
    } catch (error) {
      console.error('Error recording audit trail:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  // Define a GET route to retrieve audit trail data
 // Define a GET route to retrieve audit trail data
router.get('/auditTrailGet/:customId', async (req, res) => {
    const { customId } = req.params;
    console.log('Received request for customId:', customId);
    try {
      const customer = await Customer.findOne({ customId }).populate('auditTrailEntries');
      
      if (!customer || !customer.auditTrailEntries) {
        return res.status(404).json({ error: 'No updates till date.' });
      }
  
      const auditTrailData = customer.auditTrailEntries.map(entry => ({
        previousData: entry.previousData,
        updatedData: entry.updatedData,
        timestamp: entry.timestamp
      }));
  
      res.status(200).json(auditTrailData);
    } catch (error) {
      console.error('Error retrieving audit trail:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
module.exports = router;


//res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 