const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../../../models/user');

module.exports = {
  checkValidSignupData: async (email, password) => {
    if (!email || !password) {
      const err = new Error('Email and password is required');
      err.statusCode = 400;
      throw err;
    }
    if (!validator.isEmail(email)) {
      const err = new Error('Invalid email');
      err.statusCode = 400;
      throw err;
    }
  },
  createUser: async (email, password) => {
    // Check if user exists
    let user = await User.findOne({ email: email });
    if (user) {
      const err = new Error('User exists');
      err.statusCode = 422;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = new User({
      email: email,
      password: hashedPassword,
    });

    return user.save();
  },
};
