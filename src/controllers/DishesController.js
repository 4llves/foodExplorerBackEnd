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

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        dishId,
        name: ingredient,
      }
    })

    await knex('ingredients').insert(ingredientsInsert)

    res.json()
  }

  async show(req, res) {
    const { id } = req.params

    const dishe = await knex('dishes').where({ id }).first()
    const ingredient = await knex('ingredients')
      .where({ dishId: id })
      .orderBy('name')

    return res.json({
      ...dishe,
      ingredient,
    })
  }

  async delete(req, res) {
    const { id } = req.params

    await knex('dishes').where({ id }).delete()

    return res.json()
  }
}

module.exports = NotesController
