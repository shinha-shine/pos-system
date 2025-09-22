const userModel = require('../models/userModel');



// login user
const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await userModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User ID not found' });
    }

    if (!user.verified) {
      return res.status(401).json({ message: 'User is not verified' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
// Success
res.status(200).json({
    message: 'Login successful',
    user: {
        _id: user._id,
        name: user.name,
        userId: user.userId,
        role: user.role // Include role in the response
    }
});


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//register
const registerController = async (req, res) => {
  try {
    const { name, userId, password, role, phone, shiftTime } = req.body;

    const existingUser = await userModel.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const userData = {
      name,
      userId,
      password,
      role,
      phone,
      verified: true,
    };

    // Only include cashier-specific fields if role is cashier
    if (role === 'cashier') {
      userData.phone = phone;
      userData.shiftTime = shiftTime;
    }

    const newUser = new userModel(userData);
    await newUser.save();
    res.status(201).json({ message: 'New User Added Successfully!' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Registration failed', error });
  }
};

const cashierController = async (req, res) => {

  try {
    const cashiers = await userModel.find({ role: 'cashier' });
    res.status(200).json(cashiers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  loginController,
  registerController,
  cashierController
};
