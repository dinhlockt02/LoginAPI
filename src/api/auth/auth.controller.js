const authService = require('./auth.service');

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      await authService.checkValidLoginData(email, password);
      const user = await authService.findUser(email, password);
      const token = authService.getToken(user._id.toString());
      res.status(200).json({
        message: 'Login successful',
        token: token,
      });
    } catch (err) {
      next(err);
    }
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
