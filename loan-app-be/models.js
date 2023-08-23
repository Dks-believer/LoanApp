const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
  _id: String,
  seq: Number,
});

const Counter = mongoose.model('Counter', counterSchema);

const customerSchema = new mongoose.Schema({
  //_id: mongoose.Schema.Types.String, // Set _id to be of type String
  customId:Number,
  customerName: String,
  gurrantorName: String,
  status: String,
  loanAmount: Number,
  interestRate: Number,
  tenure: Number,
  //auditTrailEntry: Object
  auditTrailEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AuditTrail' }],
}); // Disable automatic _id generation

customerSchema.pre('save', async function () {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'customer' },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  this.customId = counter.seq;
});

const auditTrailSchema = new mongoose.Schema({
   // customId: Number, // You can change this to whatever type is appropriate
    previousData: Object, // Adjust the data types as needed
    updatedData: Object,
    timestamp: Date,
  });
  
  const AuditTrail = mongoose.model('AuditTrail', auditTrailSchema);

const Customer = mongoose.model('Customer', customerSchema);
//const AuditTrail = mongoose.model('AuditTrail', auditTrailSchema);

module.exports = Customer,AuditTrail;

