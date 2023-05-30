const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class DishesImageController {
  async update(req, res) {
    const { id: dishId } = req.params
    const imageFilename = req.file.filename

    const diskStorage = new DiskStorage()

    const dishe = await knex('dishes').where({ id: dishId }).first()

    if (!dishe) {
      throw new AppError(
        'receita não identificada, por favor contate o admin',
        401,
      )
    }

    if (dishe.image) {
      await diskStorage.deletFile(dishe.image)
    }

    const filename = await diskStorage.saveFile(imageFilename)
    dishe.image = filename

    await knex('dishes').update(dishe).where({ id: dishId })

    return res.json(dishe)
  }
}

module.exports = DishesImageController
