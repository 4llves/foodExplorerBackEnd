const knex = require('../database/knex')

class IngredientsController {
  async index(req, res) {
    const { userId } = req.params

    const ingredient = await knex('ingredients').where({ userId })

    return res.json(ingredient)
  }
}

module.exports = IngredientsController
