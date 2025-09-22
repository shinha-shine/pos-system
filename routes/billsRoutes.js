const express = require('express');
const { addBillsController,
        getBillsController,
        markBillGeneratedController
        }= require('../controllers/billsController');

const router = express.Router();

//routes

//method-post
router.post('/add-bills',addBillsController);

//method-get
router.get('/get-bills',getBillsController);

//method-put
router.put('/mark-generated/:id', markBillGeneratedController);

module.exports = router;