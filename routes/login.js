// routes/login.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    


    try {
        // Look up the user in the database based on their email
        const user = await User.findOne({ email });
        // console.log(user);
        // const storedHashedPassword = user ? user.password : null; // Retrieve the hashed password from the database if the user exists

        if (!user) {
            // User not found
            return res.status(401).json({ message: 'User not found' });
        }
        const storedHashedPassword = user.password;
        const userEnteredPassword = req.body.password; // Assuming this is how you get the password from the login request body
        const enteredPassword = password; // Get the user's entered password
        // const storedHashedPassword = user.password; // Retrieve the hashed password from the database

        bcrypt.compare(password, storedHashedPassword, (err, isPasswordValid) => {
            if (err) {
              // Handle the error
              console.error('Error comparing passwords:', err);
              return res.status(500).json({ error: 'An error occurred while comparing passwords' });
            }
      
            if (isPasswordValid) {
              // Passwords match; consider the user logged in
              res.status(200).json({ message: 'Login successful' });
            } else {
              // Passwords don't match; authentication failed
              res.status(401).json({ message: 'Authentication failed' });
            }
          });
        } catch (err) {
          // Handle other errors that may occur during login
          console.error('Error during login:', err);
          res.status(500).json({ error: 'An error occurred during login' });
    }
});

module.exports = router;
