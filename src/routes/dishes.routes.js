const { Router } = require('express')

const DishesController = require('../controllers/DishesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const dishesRoutes = Router()

const dishesController = new DishesController() // instanciando na memória

dishesRoutes.use(ensureAuthenticated) // aplicando autenticação em todas as rotas

dishesRoutes.post('/', dishesController.create)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.delete('/:id', dishesController.delete)
dishesRoutes.get('/', dishesController.index)

module.exports = dishesRoutes
