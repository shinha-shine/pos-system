const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerContact: { type: String, required: true },
  subTotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  cartItems: { type: Array, required: true },
  userId: { type: String, required: true },
   isGenerated: { type: Boolean,default: false,
  },
}, 
{ timestamps: true }
);

const Bill = mongoose.model('bills', billSchema);
module.exports = Bill;