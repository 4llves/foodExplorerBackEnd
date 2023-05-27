const { Router } = require('express')

const IngredientsController = require('../controllers/IngredientsController')

const ingredientsRoutes = Router()

const ingredientsController = new IngredientsController() // instanciando na memória

ingredientsRoutes.get('/:userId', ingredientsController.index)

module.exports = ingredientsRoutes
