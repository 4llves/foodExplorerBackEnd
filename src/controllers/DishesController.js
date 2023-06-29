const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')

class DishesController {
  async create(req, res) {
    const { name, category, price, description, ingredients } = req.body

    const { filename: imageFilename } = req.file

    const diskStorage = new DiskStorage()

    const filename = await diskStorage.saveFile(imageFilename)

    console.log({
      name,
      category,
      price,
      description,
      ingredients,
    })

    const [dishId] = await knex('dishes').insert({
      image: filename,
      name,
      category,
      price,
      description,
    })

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        dishId,
        name: ingredient,
      }
    })

    await knex('ingredients').insert(ingredientsInsert)

    return res.json()
  }

  async update(req, res) {
    const { name, category, price, description, ingredients, image } = req.body
    const { id } = req.params

    const dish = await knex('dishes').where({ id }).first()

    let filename = ''

    if (req.file && req.file.filename) {
      const imageFilename = req.file.filename
      const diskStorage = new DiskStorage()

      if (dish && dish.image) {
        await diskStorage.deleteFile(dish.image)
      }

      filename = await diskStorage.saveFile(imageFilename)
    }

    dish.image = filename ?? dish.image
    dish.name = name ?? dish.name
    dish.category = category ?? dish.category
    dish.price = price ?? dish.price
    dish.description = description ?? dish.description
    dish.image = image ?? dish.image

    await knex('dishes').where({ id }).update(dish)
    await knex('dishes').where({ id }).update('updatedAt', knex.fn.now())

    const hasOnlyOneIngredient = typeof ingredients === 'string'

    let ingredientsUpdated

    if (hasOnlyOneIngredient) {
      ingredientsUpdated = {
        dishId: dish.id,
        name: ingredients,
      }
    } else if (ingredients.length >= 1) {
      ingredientsUpdated = ingredients.map((ingredient) => {
        return {
          dishId: dish.id,
          name: ingredient,
        }
      })

      await knex('ingredients').where({ dishId: id }).delete()
      await knex('ingredients').where({ dishId: id }).insert(ingredientsUpdated)
    }

    return res.json()
  }

  async delete(req, res) {
    const { id } = req.params

    await knex('dishes').where({ id }).delete()

    return res.json()
  }

  // async index(req, res) {
  //   const { name, ingredients } = req.query // add ingredients

  //   let dishes

  //   if (ingredients) {
  //     const filterIngredients = ingredients
  //       .split(',')
  //       .map((ingredient) => ingredient.trim())

  //     // console.log(filterIngredients)

  //     dishes = await knex('ingredients')
  //       .select([
  //         'dishes.id',
  //         'dishes.name',
  //         'dishes.price',
  //         'dishes.category',
  //         'dishes.image',
  //         'dishes.price',
  //       ])
  //       .whereLike('ingredients.name', `%${name}%`)
  //       .whereIn('ingredients.name', filterIngredients)
  //       .innerJoin('dishes', 'dishes.id', 'ingredients.dishId')
  //       .orderBy('dishes.name')

  //     console.log(dishes)
  //   } else {
  //     dishes = await knex('dishes')
  //       .whereLike('dishes.name', `%${name}%`)
  //       .orderBy('name')
  //   }

  //   const dishesIngredients = await knex('ingredients')

  //   const ingredientsWithDishes = dishes.map((dish) => {
  //     const disheIngredient = dishesIngredients.filter(
  //       (ingredient) => ingredient.dishId === dish.id,
  //     )

  //     return {
  //       ...dish,
  //       ingredients: disheIngredient,
  //     }
  //   })

  //   return res.json(ingredientsWithDishes)
  // }

  async index(req, res) {
    let { search } = req.query // add ingredients

    if (search === undefined) {
      search = ''
    }

    const dishes = await knex
      .select('dishes.*')
      .from('dishes')
      .innerJoin('ingredients', 'dishes.id', '=', 'ingredients.dishId')
      .whereLike('dishes.name', `%${search}%`)
      .orWhereLike('ingredients.name', `%${search}%`)
      .groupBy('dishes.name')

    return res.json(dishes)
  }

  async show(req, res) {
    const { id } = req.params

    const dish = await knex('dishes').where({ id }).first()

    const ingredients = await knex('ingredients')
      .where({ dishId: id })
      .orderBy('name')

    return res.json({
      ...dish,
      ingredients,
    })
  }
}

module.exports = DishesController
