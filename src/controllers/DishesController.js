const knex = require('../database/knex')
const AppError = require('../utils/AppError')
// const DiskStorage = require('../providers/DiskStorage')

class DishesController {
  async create(req, res) {
    const { name, category, price, description, ingredients } = req.body

    const filename = req.file

    console.log({
      name,
      category,
      price,
      description,
      ingredients,
    })

    console.log(filename)

    // const checkExistenceOfDish = await knex('dishes').where({ name }).first()

    // if (checkExistenceOfDish) {
    //   throw new AppError('Esse prato ja existe!')
    // }

    // const [dishId] = await knex('dishes').insert({
    //   name,
    //   category,
    //   price,
    //   description,
    // })

    // const ingredientsInsert = ingredients.map((ingredient) => {
    //   return {
    //     dishId,
    //     name: ingredient,
    //   }
    // })

    // await knex('ingredients').insert(ingredientsInsert)

    // return res.json()
  }

  async delete(req, res) {
    const { id } = req.params

    await knex('dishes').where({ id }).delete()

    return res.json()
  }

  async index(req, res) {
    const { name, ingredients } = req.query // add ingredients

    let dishes

    if (ingredients) {
      const filterIngredients = ingredients
        .split(',')
        .map((ingredient) => ingredient.trim())

      // console.log(filterIngredients)

      dishes = await knex('ingredients')
        .select([
          'dishes.id',
          'dishes.name',
          'dishes.price',
          'dishes.category',
          'dishes.image',
          'dishes.price',
        ])
        .whereLike('ingredients.name', `%${ingredients}%`)
        .whereIn('ingredients.name', filterIngredients)
        .innerJoin('dishes', 'dishes.id', 'ingredients.dishId')
        .orderBy('dishes.name')

      // console.log(dishes)
    } else {
      dishes = await knex('dishes')
        .whereLike('dishes.name', `%${name}%`)
        .orderBy('name')
    }

    const userIngredients = await knex('ingredients')

    const ingredientsWithDishes = dishes.map((dishe) => {
      const dishesIngredients = userIngredients.filter(
        (ingredient) => ingredient.dishId === dishe.id,
      )

      return {
        ...dishe,
        ingredients: dishesIngredients,
      }
    })

    return res.json(ingredientsWithDishes)
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
}

module.exports = DishesController
