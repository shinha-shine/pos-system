const billsModel = require('../models/billsModel');


//add bills
const  addBillsController = async(req,res) => {
    try {
        const newBill = new billsModel(req.body);
        console.log(newBill);
        
        await newBill.save();
        res.json({ success: true, message: 'Bill added' });

    } catch (error) {
        res.send('Something Went Wrong when add data');
        console.log(error);
    }
};

//get bills
const getBillsController = async (req, res) => {
  try {
    const { role, userId } = req.query;

    let bills;

    if (role === 'customer' && userId) {
      bills = await billsModel.find({ userId }); // only this customer's bills
    } else {
      bills = await billsModel.find(); // all bills for admin/cashier
    }

    res.send(bills);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching bills');
  }
};


// ✅ New controller to mark bill as generated
const markBillGeneratedController = async (req, res) => {
  try {
    const billId = req.params.id;
    await billsModel.findByIdAndUpdate(billId, { isGenerated: true });
    res.json({ success: true, message: 'Bill marked as generated' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error marking bill as generated');
  }
};

module.exports = {
    addBillsController,
    getBillsController,
    markBillGeneratedController
};