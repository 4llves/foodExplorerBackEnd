const AppError = require('../utils/AppError');

class UsersController {
  create(req, res) {
    const { name, email, password } = req.body;

    if (!name) {
      throw new AppError('O nome é obrigatório!');
    }

    res.json({ name, email, password });
  }
}

module.exports = UsersController;