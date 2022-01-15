const bcryptjs = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const secret = require('../../../config/config').jsonTokenSecret;

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
    if (validator.isEmpty(password)) {
      const err = new Error('Password is required');
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

    const hashedPassword = await bcryptjs.hash(password, 12);

    user = new User({
      email: email,
      password: hashedPassword,
    });

    return user.save();
  },
  checkValidLoginData: async (email, password) => {
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
    if (validator.isEmpty(password)) {
      const err = new Error('Password is required');
      err.statusCode = 400;
      throw err;
    }
  },
  findUser: async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    const isEqual = await bcryptjs.compare(password, user.password);
    if (!isEqual) {
      const err = new Error('Wrong email or password');
      err.statusCode = 403;
      throw err;
    }
    return user;
  },
  getToken: (userId) => {
    const token = jwt.sign(
      {
        userId: userId,
      },
      secret,
      { expiresIn: '1h' }
    );
    return token;
  },
};
