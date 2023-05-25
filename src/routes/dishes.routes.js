const { Router } = require('express')

const DishesController = require('../controllers/DishesController')

const dishesRoutes = Router()

const dishesController = new DishesController() // instanciando na memória

dishesRoutes.post('/:userId', dishesController.create)
dishesRoutes.get('/:id', dishesController.show)

module.exports = dishesRoutes
