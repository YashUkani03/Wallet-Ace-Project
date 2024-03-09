// routes/signup.js
const express = require('express');
const router = express.Router();
const cors = require('cors'); // Import the cors middleware
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {

    const saltRounds = 10; // Specify the number of salt rounds
    const { username, email, password } = req.body;
    const userEnteredPassword = req.body.password; // Assuming this is how you get the password from the request body


    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        console.log(err);
        res.status(500).json({ 
            success:false,
            error: 'An error occurred while registering the user',
            message:err.message,
        });
    }
});

module.exports = router;