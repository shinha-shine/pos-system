const express = require('express');
const { getItemController, addItemController, editItemController ,deleteItemController}= require('../controllers/itemController');

const router = express.Router();

//routes
//method -get
router.get('/get-item',getItemController);

//method-post
router.post('/add-item',addItemController);

//metod-put
 router.put("/edit-item", editItemController);

 //metod-delete
 router.delete("/delete-item", deleteItemController);

module.exports = router