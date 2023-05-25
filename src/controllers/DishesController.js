const knex = require('../database/knex')

class NotesController {
  async create(req, res) {
    const { name, category, price, description, ingredients } = req.body
    const { userId } = req.params

    const [dishId] = await knex('dishes').insert({
      name,
      category,
      price,
      description,
      userId,
    })

    await knex('dishes').insert(dishId)

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        dishId,
        name: ingredient,
      }
    })

    await knex('ingredients').insert(ingredientsInsert)

    res.json()
  }
}

module.exports = NotesController
