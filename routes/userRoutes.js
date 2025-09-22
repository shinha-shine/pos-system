const express = require('express');
const {
  loginController,
  registerController,
  cashierController
} = require('../controllers/userController');

const router = express.Router();

//routes
router.post('/login',loginController);

//method-post
router.post('/register',registerController);

//GET route to fetch cashiers
router.get('/cashiers' , cashierController);


module.exports = router