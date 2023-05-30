const { Router } = require('express')
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const DishesController = require('../controllers/DishesController')
const DishesImageController = require('../controllers/DishesImageController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController() // instanciando na memória
const dishesImageController = new DishesImageController() // instanciando na memória

dishesRoutes.use(ensureAuthenticated) // aplicando autenticação em todas as rotas

dishesRoutes.post('/', dishesController.create)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.delete('/:id', dishesController.delete)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.patch(
  '/dishesimg/:id',
  ensureAuthenticated,
  upload.single('dishesimg'),
  dishesImageController.update,
)

module.exports = dishesRoutes
