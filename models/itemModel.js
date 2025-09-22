const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String, // ➕ Add this line
      required: false,
      default: '',  // optional but safe
    },
  },
  { timestamps: true } // ✅ fix: `timestamp` ➜ `timestamps`
);

const Items = mongoose.model("Items", itemSchema);
module.exports = Items;
