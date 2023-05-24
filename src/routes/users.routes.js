const { Router } = require('express')

const UsersController = require('../controllers/UsersController')

const usersRoutes = Router()

const usersController = new UsersController() // instanciando na memória

usersRoutes.post('/', usersController.create)

module.exports = usersRoutes
