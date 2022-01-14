const authService = require('./auth.service');

module.exports = {
  login: async (req, res) => {
    res.json('login');
  },
  signup: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      await authService.checkValidSignupData(email, password);

      await authService.createUser(email, password);

      res.status(201).json({
        message: 'Create user successful',
      });
    } catch (err) {
      next(err);
    }
  },
};
